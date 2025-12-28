// Core Types for STRYKER Cricket Platform

export type MatchStatus = 'LIVE' | 'UPCOMING' | 'FINISHED';

export interface Team {
  id: string;
  name: string;
  shortName: string;
  flagUrl?: string;
}

export interface BatsmanStats {
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  isOnStrike: boolean;
}

export interface BowlerStats {
  name: string;
  overs: string;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
}

export interface InningsScore {
  team: Team;
  runs: number;
  wickets: number;
  overs: string;
  runRate: number;
  declared?: boolean;
}

export interface Match {
  id: string;
  tournament: string;
  matchType: string;
  venue: string;
  status: MatchStatus;
  statusText: string;
  startTime: string; // ISO string
  team1: Team;
  team2: Team;
  innings: InningsScore[];
  currentBatsmen?: BatsmanStats[];
  currentBowler?: BowlerStats;
  recentOvers?: string;
  importance?: 'HIGH' | 'MEDIUM' | 'LOW';
  context?: string; // e.g., "Winner qualifies for Finals"
}

export interface CommentaryBall {
  id: string;
  over: string;
  ball: number;
  runs: number;
  isWicket: boolean;
  isBoundary: boolean;
  isSix: boolean;
  description: string;
  timestamp: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  imageUrl?: string;
  category: 'news' | 'analysis' | 'opinion';
}

export interface DiscussionPost {
  id: string;
  matchId?: string;
  author: {
    name: string;
    avatar?: string;
  };
  content: string;
  likes: number;
  replies: number;
  createdAt: string;
}

export interface ScorecardEntry {
  batsman: string;
  dismissal: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
}

export interface BowlingFigures {
  bowler: string;
  overs: string;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
  wides: number;
  noBalls: number;
}

export interface FullScorecard {
  innings: number;
  team: Team;
  batting: ScorecardEntry[];
  bowling: BowlingFigures[];
  extras: {
    byes: number;
    legByes: number;
    wides: number;
    noBalls: number;
    penalties: number;
    total: number;
  };
  total: {
    runs: number;
    wickets: number;
    overs: string;
  };
  fallOfWickets: string[];
}
