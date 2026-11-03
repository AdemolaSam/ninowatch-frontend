"use client";
import { ArrowLeft, Download } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { CopyButton } from "@/components/common/CopyButton";
import { GlassCard } from "@/components/common/GlassCard";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { ErrorBlock, LoadingBlock } from "@/components/common/States";
import { useOutletPackage, useRegion } from "@/lib/queries";

function download(name: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
  const a = Object.assign(document.createElement("a"), { href: url, download: name });
  a.click();
  URL.revokeObjectURL(url);
}

export default function OutletPage() {
  const { id } = useParams<{ id: string }>();
  const [lang, setLang] = useState("en");
  const region = useRegion(id);
  const pack = useOutletPackage(id, lang);

  if (region.isError || pack.isError) return <main className="mx-auto max-w-xl p-4"><ErrorBlock message="Could not load the pack." onRetry={() => pack.refetch()} /></main>;
  if (!region.data || !pack.data) return <main className="mx-auto max-w-xl p-4"><LoadingBlock /></main>;
  const p = pack.data;

  return (
    <main className="mx-auto flex max-w-xl flex-col gap-3 p-4">
      <div><Link href={`/region/${id}`} className="btn"><ArrowLeft size={16} aria-hidden /> Back</Link></div>
      <h1 className="text-3xl font-light">Broadcaster advisory pack</h1>
      <p className="text-sm text-muted">{region.data.name}. Ready to read on air or send.</p>
      <LanguageSwitcher languages={region.data.languages.filter((language) => language.code === "en")} value={lang} onChange={setLang} />
      <GlassCard className="space-y-3">
        <div><p className="label">Radio script</p><p className="text-xs text-muted">About 30 seconds</p></div>
        <p className="text-[15px] leading-relaxed">{p.radioScript}</p>
        <div className="flex gap-2">
          <CopyButton text={p.radioScript} className="flex-1" />
          <button className="btn flex-1" onClick={() => download(`radio-${id}-${lang}.txt`, p.radioScript)}><Download size={16} aria-hidden /> Download</button>
        </div>
      </GlassCard>
      <GlassCard className="space-y-3">
        <div><p className="label">SMS alert</p><p className="text-xs text-muted">{p.sms.length} of 160 characters</p></div>
        <p className=" bg-black/25 p-2.5 text-[15px] leading-relaxed">{p.sms}</p>
        <CopyButton text={p.sms} className="w-full" />
      </GlassCard>
      <p className="text-xs text-muted">English broadcaster draft. Review against source evidence before broadcast.</p>
    </main>
  );
}
