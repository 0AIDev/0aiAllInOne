import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/auth-options";
import { stripe, STRIPE_PLANS } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

const PRICE_PER_CREDIT = 100; // 1 credit = 100 cents = $1

export async function POST(request: NextRequest) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { planTier, credits } = await request.json();

  if (!stripe) return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });

  const tenant = await prisma.tenant.findUnique({ where: { id: session.tenantId } });
  if (!tenant) return NextResponse.json({ error: "Tenant not found" }, { status: 404 });

  let stripeCustomerId = tenant.stripeCustomerId;
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: session.email,
      metadata: { tenantId: session.tenantId },
    });
    stripeCustomerId = customer.id;
    await prisma.tenant.update({
      where: { id: session.tenantId },
      data: { stripeCustomerId },
    });
  }

  // Credits purchase
  if (credits) {
    const amount = credits * PRICE_PER_CREDIT;
    const checkout = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: "payment",
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { name: `${credits.toLocaleString()} AI0FY Credits` },
          unit_amount: amount,
        },
        quantity: 1,
      }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://ai0fy.vercel.app"}/dashboard/subscription?credits_success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://ai0fy.vercel.app"}/dashboard/subscription`,
      metadata: { tenantId: session.tenantId, credits: String(credits) },
    });
    return NextResponse.json({ url: checkout.url });
  }

  // Subscription plan change
  const plan = STRIPE_PLANS[planTier as keyof typeof STRIPE_PLANS];
  if (!plan || plan.monthlyPrice === 0) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const checkout = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    mode: "subscription",
    line_items: [{ price_data: {
      currency: "usd",
      product_data: { name: `${plan.tier} Plan` },
      unit_amount: plan.monthlyPrice,
      recurring: { interval: "month" },
    }, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://ai0fy.vercel.app"}/dashboard/subscription?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://ai0fy.vercel.app"}/dashboard/subscription?canceled=true`,
    metadata: { tenantId: session.tenantId, planTier },
  });

  return NextResponse.json({ url: checkout.url });
}
