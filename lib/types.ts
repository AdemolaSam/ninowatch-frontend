export type Risk = "moderate" | "high" | "extreme";
export type Verification = "confirmed" | "corroborated" | "unverified";
export interface Language { code: string; label: string }
export interface Region { id: string; names: string[]; bbox: [number, number, number, number]; intensity: number; heat: number[]; countries?: { name: string; value: number }[]; name: string; risk: Risk; lat: number; lng: number; languages: Language[] }
export interface Incident { id: string; regionId: string; lat: number; lng: number; title: string; status: Verification; evidence: string }
export interface Advisory { regionId: string; lang: string; available: boolean; happening: string; atRisk: string; actions: string; reviewStatus?: "source" | "reviewed" | "machine_preview" | "unavailable"; sourceEnglish?: { happening: string; atRisk: string; actions: string } }
export interface OutletPackage { regionId: string; lang: string; available: boolean; radioScript: string; sms: string }
export interface Country { id: string; name: string; polys: number[][][][] }
export interface Outlook { regionId: string; hazard: string; summary: string; source: string; sourceUrl: string; issuedAt: string; validThrough: string }
export interface CommunityReport { id: number; regionId: string; incidentId: string | null; kind: string; placeName: string; occurredAt: string | null; description: string; sourceUrl: string | null; status: string; createdAt: string }
export interface ReportInput { regionId: string; incidentId?: number; kind: string; placeName: string; occurredAt?: string; description: string; sourceUrl?: string }
export interface Climate { bbox: [number, number, number, number]; cols: number; rows: number; baselineYears: string; generatedAt: string; cells: { lat: number; lng: number; temp: number; anomaly: number | null }[] }
