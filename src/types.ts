export interface Challenge {
  id: string;
  name: string;
  description: string;
  xp: number;
  questType: string;
  storyContext?: string;
  chapter?: string;
  season?: string;
}

export interface ChallengeWithProgress extends Challenge {
  completed: boolean;
  completedAt?: string;
}

export interface ApiChallenge {
  id?: string;
  name: string;
  description: string;
  xp?: number;
  storyContext?: string;
  chapter?: string;
  season?: string;
}

export interface ApiResponse {
  challenges: ApiChallenge[];
}

export interface ApiError {
  message: string;
  status?: number;
}