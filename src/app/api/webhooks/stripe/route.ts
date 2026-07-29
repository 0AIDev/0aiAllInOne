import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;

  try {
    if (!stripe) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
    }
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      // ─── Customer ─────────────────────────────
      case "customer.created":
        await handleCustomerCreated(event.data.object as Stripe.Customer);
        break;

      case "customer.updated":
        await handleCustomerUpdated(event.data.object as Stripe.Customer);
        break;

      case "customer.deleted":
        await handleCustomerDeleted(event.data.object as Stripe.Customer);
        break;

      // ─── Subscription ─────────────────────────
      case "customer.subscription.created":
        await handleSubscriptionCreated(
          event.data.object as Stripe.Subscription
        );
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription
        );
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription
        );
        break;

      case "customer.subscription.paused":
        await handleSubscriptionPaused(
          event.data.object as Stripe.Subscription
        );
        break;

      case "customer.subscription.resumed":
        await handleSubscriptionResumed(
          event.data.object as Stripe.Subscription
        );
        break;

      case "customer.subscription.trial_will_end":
        await handleTrialWillEnd(
          event.data.object as Stripe.Subscription
        );
        break;

      // ─── Invoice ──────────────────────────────
      case "invoice.paid":
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(
          event.data.object as Stripe.Invoice
        );
        break;

      case "invoice.payment_action_required":
        await handleInvoicePaymentActionRequired(
          event.data.object as Stripe.Invoice
        );
        break;

      // ─── Payment Intent ───────────────────────
      case "payment_intent.succeeded":
        break;
      case "payment_intent.payment_failed":
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

// ─── Customer Handlers ──────────────────────────────────────

async function handleCustomerCreated(customer: Stripe.Customer) {
  if (!customer.email) return;

  const existingTenant = await prisma.tenant.findFirst({
    where: { OR: [{ stripeCustomerId: customer.id }, { billingEmail: customer.email }] },
  });

  if (existingTenant) {
    await prisma.tenant.update({
      where: { id: existingTenant.id },
      data: { stripeCustomerId: customer.id },
    });
  }
}

async function handleCustomerUpdated(customer: Stripe.Customer) {
  if (!customer.email) return;

  await prisma.tenant.updateMany({
    where: { stripeCustomerId: customer.id },
    data: { billingEmail: customer.email },
  });
}

async function handleCustomerDeleted(customer: Stripe.Customer) {
  await prisma.tenant.updateMany({
    where: { stripeCustomerId: customer.id },
    data: { stripeCustomerId: null },
  });
}

// ─── Subscription Handlers ──────────────────────────────────

async function handleSubscriptionCreated(
  subscription: Stripe.Subscription
) {
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;

  const tenant = await prisma.tenant.findUnique({
    where: { stripeCustomerId: customerId },
  });
  if (!tenant) {
    console.error("Tenant not found for customer:", customerId);
    return;
  }

  const priceId = subscription.items.data[0]?.price.id;

  const status = mapStripeStatus(subscription.status);
  const planTier = getPlanTierFromPrice(priceId);

  await prisma.subscription.create({
    data: {
      tenantId: tenant.id,
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId ?? "",
      status,
      planTier,
      billingInterval: subscription.items.data[0]?.plan?.interval === "year" ? "YEARLY" : "MONTHLY",
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      trialEndsAt: subscription.trial_end
        ? new Date(subscription.trial_end * 1000)
        : null,
    },
  });

  await prisma.tenant.update({
    where: { id: tenant.id },
    data: { planTier },
  });

  await updateTenantQuota(tenant.id, planTier);
}

async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
) {
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;

  const priceId = subscription.items.data[0]?.price.id;

  const status = mapStripeStatus(subscription.status);
  const planTier = getPlanTierFromPrice(priceId);

  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      stripePriceId: priceId ?? "",
      status,
      planTier,
      billingInterval: subscription.items.data[0]?.plan?.interval === "year" ? "YEARLY" : "MONTHLY",
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      trialEndsAt: subscription.trial_end
        ? new Date(subscription.trial_end * 1000)
        : null,
    },
  });

  if (subscription.cancel_at_period_end) {
    await prisma.subscription.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: { canceledAt: new Date() },
    });
  }

  const tenant = await prisma.tenant.findUnique({
    where: { stripeCustomerId: customerId },
  });
  if (tenant) {
    await prisma.tenant.update({
      where: { id: tenant.id },
      data: { planTier },
    });
    await updateTenantQuota(tenant.id, planTier);
  }
}

async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
) {
  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: { status: "CANCELED", canceledAt: new Date() },
  });

  const existingSub = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: subscription.id },
    select: { tenantId: true },
  });

  if (existingSub) {
    await prisma.tenant.update({
      where: { id: existingSub.tenantId },
      data: { planTier: "FREE" },
    });
    await updateTenantQuota(existingSub.tenantId, "FREE");
  }
}

async function handleSubscriptionPaused(subscription: Stripe.Subscription) {
  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: { status: "PAUSED" },
  });
}

async function handleSubscriptionResumed(subscription: Stripe.Subscription) {
  const status = mapStripeStatus(subscription.status);
  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: { status },
  });
}

async function handleTrialWillEnd(subscription: Stripe.Subscription) {
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;

  const tenant = await prisma.tenant.findUnique({
    where: { stripeCustomerId: customerId },
  });

  if (tenant) {
    await prisma.auditLog.create({
      data: {
        tenantId: tenant.id,
        action: "TRIAL_WILL_END",
        resource: "subscription",
        resourceId: subscription.id,
        details: JSON.stringify({
          trialEndsAt: new Date(subscription.trial_end! * 1000).toISOString(),
        }),
      },
    });
  }
}

// ─── Invoice Handlers ───────────────────────────────────────

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  if (!invoice.subscription) return;

  const subId =
    typeof invoice.subscription === "string"
      ? invoice.subscription
      : invoice.subscription.id;

  const subscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: subId },
  });
  if (!subscription) return;

  if (invoice.id) {
    await prisma.invoice.upsert({
      where: { stripeInvoiceId: invoice.id },
      update: {
        amount: invoice.amount_paid,
        currency: invoice.currency,
        status: invoice.status ?? "paid",
        hostedUrl: invoice.hosted_invoice_url ?? undefined,
        invoicePdf: invoice.invoice_pdf ?? undefined,
        paidAt: invoice.status === "paid" ? new Date() : undefined,
      },
      create: {
        subscriptionId: subscription.id,
        stripeInvoiceId: invoice.id,
        amount: invoice.amount_paid,
        currency: invoice.currency,
        status: invoice.status ?? "paid",
        hostedUrl: invoice.hosted_invoice_url ?? undefined,
        invoicePdf: invoice.invoice_pdf ?? undefined,
        paidAt: invoice.status === "paid" ? new Date() : undefined,
      },
    });
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  if (!invoice.subscription) return;

  const subId =
    typeof invoice.subscription === "string"
      ? invoice.subscription
      : invoice.subscription.id;

  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subId },
    data: { status: "PAST_DUE" },
  });

  const subscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: subId },
  });
  if (!subscription) return;

  if (invoice.id) {
    await prisma.invoice.upsert({
      where: { stripeInvoiceId: invoice.id },
      update: {
        amount: invoice.amount_due,
        currency: invoice.currency,
        status: invoice.status ?? "open",
        hostedUrl: invoice.hosted_invoice_url ?? undefined,
      },
      create: {
        subscriptionId: subscription.id,
        stripeInvoiceId: invoice.id,
        amount: invoice.amount_due,
        currency: invoice.currency,
        status: invoice.status ?? "open",
        hostedUrl: invoice.hosted_invoice_url ?? undefined,
      },
    });
  }
}

async function handleInvoicePaymentActionRequired(invoice: Stripe.Invoice) {
  console.log("Payment action required for invoice:", invoice.id);
}

// ─── Helpers ────────────────────────────────────────────────

function mapStripeStatus(
  stripeStatus: Stripe.Subscription.Status
): "TRIALING" | "ACTIVE" | "PAST_DUE" | "CANCELED" | "INCOMPLETE" | "INCOMPLETE_EXPIRED" | "UNPAID" | "PAUSED" {
  const mapping: Record<string, ReturnType<typeof mapStripeStatus>> = {
    trialing: "TRIALING",
    active: "ACTIVE",
    past_due: "PAST_DUE",
    canceled: "CANCELED",
    unpaid: "UNPAID",
    incomplete: "INCOMPLETE",
    incomplete_expired: "INCOMPLETE_EXPIRED",
    paused: "PAUSED",
  };
  return mapping[stripeStatus] ?? "INCOMPLETE";
}

const PLAN_PRICE_MAP: Record<string, "FREE" | "STARTER" | "PRO" | "BUSINESS" | "ENTERPRISE"> = {};

function getPlanTierFromPrice(
  priceId: string | undefined
): "FREE" | "STARTER" | "PRO" | "BUSINESS" | "ENTERPRISE" {
  if (!priceId) return "FREE";

  // Check runtime map first
  if (PLAN_PRICE_MAP[priceId]) return PLAN_PRICE_MAP[priceId]!;

  if (priceId.includes("starter")) return "STARTER";
  if (priceId.includes("pro")) return "PRO";
  if (priceId.includes("business")) return "BUSINESS";
  if (priceId.includes("enterprise")) return "ENTERPRISE";

  return "FREE";
}

async function updateTenantQuota(
  tenantId: string,
  planTier: "FREE" | "STARTER" | "PRO" | "BUSINESS" | "ENTERPRISE"
) {
  const quotas: Record<string, { hardQuotaTokens: number; softQuotaTokens: number }> = {
    FREE: { hardQuotaTokens: 100_000, softQuotaTokens: 85_000 },
    STARTER: { hardQuotaTokens: 5_000_000, softQuotaTokens: 4_250_000 },
    PRO: { hardQuotaTokens: 20_000_000, softQuotaTokens: 17_000_000 },
    BUSINESS: { hardQuotaTokens: 100_000_000, softQuotaTokens: 85_000_000 },
    ENTERPRISE: { hardQuotaTokens: 500_000_000, softQuotaTokens: 425_000_000 },
  };

  const quota = quotas[planTier] ?? quotas.FREE;

  await prisma.tenant.update({
    where: { id: tenantId },
    data: {
      hardQuotaTokens: quota!.hardQuotaTokens,
      softQuotaTokens: quota!.softQuotaTokens,
      quotaResetAt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
    },
  });
}
