export interface User {
  _id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  googleId?: string;
  tier : 'FREE' | 'PRO'
}

export interface Project {
  _id: string;
  name: string;
  stagingUrl: string;
  productionUrl: string;
  createdAt: string;
  apikey?: string;
  geminiApiKey?: string;
  owner?: string | User;
  tier?: 'FREE' | 'PRO';
}

export interface TestRun {
  _id: string;
  projectId: string;
  status: 'PASSED' | 'FAILED' | 'RUNNING';
  stagingUrl?: string;
  productionUrl?: string;
  mismatchPercentage: number;
  totalPixelsCompared: number;
  mismatchPixelsCount: number;
  stagingScreenshotUrl: string;
  productionScreenshotUrl: string;
  diffScreenshotUrl: string;
  isPro?: boolean;
  visualBugs: Array<{
    element: string;
    description: string;
    location: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    aiSuggestion?: {
      explanation: string;
      cssFix: string;
    };
  }>;
  createdAt: string;
}