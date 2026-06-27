export type ActiveTab = string;

export interface ThreatReport {
  id: string;
  district: string;
  category: string;
  target: string;
  description?: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  status: string;
  riskScore: number;
  timestamp: string;
}

export interface ScanResult {
  target: string;
  threatType: string;
  riskScore: number;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  aiAnalysis: string;
  details: string[];
  recommendations: string[];
  isLiveAI: boolean;
  isWarning?: boolean;
  timestamp: string;
}

export interface DistrictStat {
  name: string;
  threatScore: number; // 0 to 100
  casesCount: number;
  criticalCount: number;
  topThreatType: string;
}
