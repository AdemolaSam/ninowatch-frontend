"use client";
import { ArrowLeft, Radio } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { GlassCard } from "@/components/common/GlassCard";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { ErrorBlock, LoadingBlock } from "@/components/common/States";
import { VerificationBadge } from "@/components/common/VerificationBadge";
import { useAdvisory, useIncidents, useOutlooks, useRegion, useReports } from "@/lib/queries";
import { ReportForm } from "@/app/_components/ReportForm";

export default function RegionPage() {
  const { id } = useParams<{ id: string }>();
  const [lang, setLang] = useState("en");
  const region = useRegion(id);
  const advisory = useAdvisory(id, lang);
  const events = useIncidents(id);
  const outlooks = useOutlooks();
  const reports = useReports(id);

  if (region.isPending) return <main className="mx-auto max-w-xl p-4"><LoadingBlock /></main>;
  if (region.isError) return <main className="mx-auto max-w-xl p-4"><ErrorBlock message="Region not found." /></main>;
  const r = region.data;
  const outlook = outlooks.data?.find((item) => item.regionId === id);

  return (
    <main className="mx-auto flex max-w-xl flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <Link href="/" className="btn"><ArrowLeft size={16} aria-hidden /> Back</Link>
        <span className="text-xs text-muted">Seasonal outlook area</span>
      </div>
      <h1 className="text-3xl font-light">{r.name}</h1>
      {outlook && <GlassCard className="space-y-1 text-sm">
        <p className="label">{outlook.hazard} outlook</p>
        <p>{outlook.summary}</p>
        <p className="text-xs text-muted">Valid through {outlook.validThrough}. Seasonal forecast, not a reported incident.</p>
        <a className="text-xs underline" href={outlook.sourceUrl} target="_blank" rel="noreferrer">{outlook.source}</a>
      </GlassCard>}
      <LanguageSwitcher languages={r.languages} value={lang} onChange={setLang} />
      {advisory.data && !advisory.data.available && <p className="text-xs text-muted">Translation is not available yet. Showing English.</p>}
      {advisory.data?.reviewStatus === "machine_preview" && <p className="text-xs text-muted">Machine translation by Muse Spark. Review before use.</p>}
      {advisory.isPending ? <LoadingBlock /> : advisory.isError ? <p className="text-sm text-muted">Advisory is not available for this area yet.</p> : (
        <GlassCard className="space-y-2 text-[15px] leading-relaxed">
          <p className="label">Current advisory</p>
          <p><b className="font-semibold">What is happening:</b> {advisory.data.happening}</p>
          <p><b className="font-semibold">Who is at risk:</b> {advisory.data.atRisk}</p>
          <p><b className="font-semibold">What to do:</b> {advisory.data.actions}</p>
          {lang !== "en" && advisory.data.available && advisory.data.sourceEnglish && <div className="border-t border-[var(--separator)] pt-2 text-sm text-muted">
            <p className="label">English source</p>
            <p>{advisory.data.sourceEnglish.happening} {advisory.data.sourceEnglish.actions}</p>
          </div>}
        </GlassCard>
      )}
      <GlassCard className="space-y-3.5">
        <p className="label">Verified reports</p>
        {events.isPending && <LoadingBlock lines={2} />}
        {events.data?.length === 0 && <p className="text-sm text-muted">No reports for this region yet.</p>}
        {events.data?.map((i) => (
          <div key={i.id}><VerificationBadge status={i.status} /><p className="my-1.5 text-sm">{i.title}</p><p className="text-xs text-muted">{i.evidence}</p></div>
        ))}
      </GlassCard>
      <GlassCard className="space-y-2">
        <p className="label">Reviewed community evidence</p>
        {reports.data?.length ? reports.data.map((report) => <div key={report.id} className="border-t border-[var(--separator)] pt-2 text-sm">
          <p>{report.kind} in {report.placeName}: {report.description}</p>
          {report.sourceUrl && <a className="underline" href={report.sourceUrl} target="_blank" rel="noreferrer">Supporting source</a>}
          <p className="text-xs text-muted">Reviewed community report. Does not change the incident verification label.</p>
        </div>) : <p className="text-sm text-muted">No reviewed community reports yet.</p>}
      </GlassCard>
      <ReportForm regionId={id} incidents={events.data ?? []} />
      {!advisory.isError && <Link href={`/outlet/${r.id}`} className="btn btn-primary"><Radio size={16} aria-hidden /> For broadcasters: get radio script</Link>}
      <p className="text-xs text-muted">Labels show strength of evidence, not certainty.</p>
    </main>
  );
}
