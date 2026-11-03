"use client";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CopyButton({ text, className = "" }: { text: string; className?: string }) {
  const [done, setDone] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(text);
    setDone(true);
    setTimeout(() => setDone(false), 1500);
  }
  return (
    <button className={`btn btn-primary ${className}`} onClick={copy} aria-live="polite">
      {done ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />} {done ? "Copied" : "Copy"}
    </button>
  );
}
