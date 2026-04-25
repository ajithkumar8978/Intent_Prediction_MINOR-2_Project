export interface SessionData {
  timeSpent: number; // in seconds
  pagesVisited: number;
  bounceRate: number; // percentage
  trafficSource: 'Organic' | 'Direct' | 'Paid' | 'Referral' | 'Social';
  deviceType: 'Desktop' | 'Mobile' | 'Tablet';
}

export interface PredictionResult {
  id: string;
  createdAt: string;
  sessionData: SessionData;
  intent: 'Yes' | 'No';
  confidenceScore: number;
  reasoning: string;
}
