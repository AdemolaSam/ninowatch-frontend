import type { Language } from "@/lib/types";

export function LanguageSwitcher({ languages, value, onChange }: { languages: Language[]; value: string; onChange: (code: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Language">
      {languages.map((l) => (
        <button key={l.code} className="btn" aria-pressed={l.code === value} onClick={() => onChange(l.code)}>
          {l.label}
        </button>
      ))}
    </div>
  );
}
