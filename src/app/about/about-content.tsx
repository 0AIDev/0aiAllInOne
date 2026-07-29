"use client";

import { useLocale } from "@/i18n/locale-provider";

export function AboutContent({ team }: { team: { initials: string; name: string; role: string }[] }) {
  const { t } = useLocale();
  return (
    <>
      <h1 className="text-[clamp(32px,5vw,48px)] font-medium leading-[1.1] tracking-[-0.02em] text-[#0F0F0E]" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
        <em className="italic" style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}>
          {t("about.title")}
        </em>
      </h1>

      <p className="mt-4 text-lg text-[#3A3A37] leading-relaxed max-w-3xl">
        {t("about.description")}
      </p>

      <div className="mt-16">
        <h2 className="text-2xl font-medium text-[#0F0F0E]">{t("about.missionTitle")}</h2>
        <p className="mt-4 text-[#3A3A37] leading-relaxed">{t("about.missionDesc")}</p>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-medium text-[#0F0F0E]">{t("about.teamTitle")}</h2>
        <p className="mt-2 text-[#3A3A37]">{t("about.teamDesc")}</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <div key={member.name} className="rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white p-6 text-center transition-all hover:shadow-md">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#0F0F0E] text-lg font-medium text-white">
                {member.initials}
              </div>
              <h3 className="mt-4 font-medium text-[#0F0F0E]">{member.name}</h3>
              <p className="mt-1 text-sm text-[#7A7870]">{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-medium text-[#0F0F0E]">{t("about.whyTitle")}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white p-6">
            <h3 className="font-medium text-[#0F0F0E]">{t("about.card1Title")}</h3>
            <p className="mt-2 text-sm text-[#3A3A37]">{t("about.card1Desc")}</p>
          </div>
          <div className="rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white p-6">
            <h3 className="font-medium text-[#0F0F0E]">{t("about.card2Title")}</h3>
            <p className="mt-2 text-sm text-[#3A3A37]">{t("about.card2Desc")}</p>
          </div>
          <div className="rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white p-6">
            <h3 className="font-medium text-[#0F0F0E]">{t("about.card3Title")}</h3>
            <p className="mt-2 text-sm text-[#3A3A37]">{t("about.card3Desc")}</p>
          </div>
          <div className="rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white p-6">
            <h3 className="font-medium text-[#0F0F0E]">{t("about.card4Title")}</h3>
            <p className="mt-2 text-sm text-[#3A3A37]">{t("about.card4Desc")}</p>
          </div>
        </div>
      </div>
    </>
  );
}
