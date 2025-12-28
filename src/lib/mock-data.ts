// Mock Data for STRYKER - Simulates FastAPI Backend Responses

import type { Match, NewsItem, DiscussionPost, CommentaryBall, FullScorecard } from './types';

export const mockMatches: Match[] = [
  {
    id: '1',
    tournament: 'ICC Cricket World Cup 2024',
    matchType: 'ODI',
    venue: 'Melbourne Cricket Ground, Australia',
    status: 'LIVE',
    statusText: 'India need 47 runs from 42 balls',
    startTime: new Date().toISOString(),
    team1: { id: 'ind', name: 'India', shortName: 'IND' },
    team2: { id: 'aus', name: 'Australia', shortName: 'AUS' },
    innings: [
      { team: { id: 'aus', name: 'Australia', shortName: 'AUS' }, runs: 287, wickets: 8, overs: '50.0', runRate: 5.74 },
      { team: { id: 'ind', name: 'India', shortName: 'IND' }, runs: 241, wickets: 4, overs: '43.0', runRate: 5.60 },
    ],
    currentBatsmen: [
      { name: 'V Kohli', runs: 89, balls: 97, fours: 8, sixes: 2, strikeRate: 91.75, isOnStrike: true },
      { name: 'KL Rahul', runs: 45, balls: 52, fours: 4, sixes: 1, strikeRate: 86.54, isOnStrike: false },
    ],
    currentBowler: { name: 'M Starc', overs: '8.0', maidens: 1, runs: 52, wickets: 2, economy: 6.50 },
    recentOvers: '1 4 0 1 W 2 | 0 1 1 4 0 6',
    importance: 'HIGH',
    context: 'Winner advances to Semi-Finals',
  },
  {
    id: '2',
    tournament: 'Border-Gavaskar Trophy 2024-25',
    matchType: 'Test - Day 3',
    venue: 'Sydney Cricket Ground, Australia',
    status: 'LIVE',
    statusText: 'Australia lead by 156 runs',
    startTime: new Date().toISOString(),
    team1: { id: 'aus', name: 'Australia', shortName: 'AUS' },
    team2: { id: 'ind', name: 'India', shortName: 'IND' },
    innings: [
      { team: { id: 'aus', name: 'Australia', shortName: 'AUS' }, runs: 445, wickets: 10, overs: '112.3', runRate: 3.96 },
      { team: { id: 'ind', name: 'India', shortName: 'IND' }, runs: 289, wickets: 10, overs: '89.2', runRate: 3.23 },
      { team: { id: 'aus', name: 'Australia', shortName: 'AUS' }, runs: 0, wickets: 0, overs: '0.0', runRate: 0 },
    ],
    importance: 'HIGH',
    context: 'Series decider - 2-2 going into final Test',
  },
  {
    id: '3',
    tournament: 'Big Bash League 2024-25',
    matchType: 'T20',
    venue: 'Adelaide Oval, Australia',
    status: 'UPCOMING',
    statusText: 'Starts in 4 hours',
    startTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    team1: { id: 'ads', name: 'Adelaide Strikers', shortName: 'ADS' },
    team2: { id: 'mls', name: 'Melbourne Stars', shortName: 'MLS' },
    innings: [],
    importance: 'MEDIUM',
  },
  {
    id: '4',
    tournament: 'SA20 League 2025',
    matchType: 'T20',
    venue: 'Wanderers, Johannesburg',
    status: 'FINISHED',
    statusText: 'Sunrisers Eastern Cape won by 6 wickets',
    startTime: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    team1: { id: 'jsk', name: 'Joburg Super Kings', shortName: 'JSK' },
    team2: { id: 'sec', name: 'Sunrisers Eastern Cape', shortName: 'SEC' },
    innings: [
      { team: { id: 'jsk', name: 'Joburg Super Kings', shortName: 'JSK' }, runs: 165, wickets: 7, overs: '20.0', runRate: 8.25 },
      { team: { id: 'sec', name: 'Sunrisers Eastern Cape', shortName: 'SEC' }, runs: 166, wickets: 4, overs: '18.3', runRate: 8.97 },
    ],
    importance: 'LOW',
  },
  {
    id: '5',
    tournament: 'ICC Cricket World Cup 2024',
    matchType: 'ODI',
    venue: 'Eden Gardens, Kolkata',
    status: 'UPCOMING',
    statusText: 'Tomorrow, 9:30 AM ET',
    startTime: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(),
    team1: { id: 'eng', name: 'England', shortName: 'ENG' },
    team2: { id: 'pak', name: 'Pakistan', shortName: 'PAK' },
    innings: [],
    importance: 'HIGH',
    context: 'Knockout match - Loser eliminated',
  },
];

export const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'Kohli enters rare club with 50th ODI century',
    summary: 'Virat Kohli joined Sachin Tendulkar as the only batsmen to score 50 ODI centuries, achieving the milestone against Australia in the World Cup quarter-final.',
    source: 'ESPNcricinfo',
    url: '#',
    publishedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    category: 'news',
  },
  {
    id: '2',
    title: 'Analysis: Why Australia\'s bowling attack is the most complete in world cricket',
    summary: 'With Starc, Hazlewood, and Cummins in form, we break down what makes this pace trio so effective in different conditions.',
    source: 'The Cricket Monthly',
    url: '#',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    category: 'analysis',
  },
  {
    id: '3',
    title: 'BCCI announces squad for upcoming New Zealand tour',
    summary: 'India has named a 16-member squad for the three-match ODI series against New Zealand, with Rohit Sharma returning as captain after missing the Australia tests.',
    source: 'Cricbuzz',
    url: '#',
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    category: 'news',
  },
  {
    id: '4',
    title: 'Opinion: The case for including impact players in Test cricket',
    summary: 'As T20 leagues innovate with new rules, should Test cricket adapt to survive? A controversial proposal examined.',
    source: 'Wisden',
    url: '#',
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    category: 'opinion',
  },
  {
    id: '5',
    title: 'Root surpasses Cook to become England\'s all-time leading Test run scorer',
    summary: 'Joe Root reached the milestone during the second Test against Bangladesh, ending the day on 12,473 runs.',
    source: 'Sky Sports',
    url: '#',
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    category: 'news',
  },
];

export const mockDiscussions: DiscussionPost[] = [
  {
    id: '1',
    matchId: '1',
    author: { name: 'CricketFan_NYC' },
    content: 'Kohli is playing the innings of his life here. The way he\'s rotating strike and picking gaps is vintage. Reminds me of the 2016 World T20 knock against Australia.',
    likes: 234,
    replies: 45,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    matchId: '1',
    author: { name: 'TestCricketPurist' },
    content: 'Starc\'s slower balls have been incredible this tournament. His variation has evolved so much since 2019.',
    likes: 89,
    replies: 12,
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    author: { name: 'BayAreaCricket' },
    content: 'Anyone else watching from California? It\'s 2 AM but absolutely worth it. This World Cup has been phenomenal.',
    likes: 156,
    replies: 67,
    createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    matchId: '2',
    author: { name: 'SydneySider' },
    content: 'The SCG pitch is offering more turn than expected. Day 4 could be decisive if India can\'t restrict Australia\'s lead to under 200.',
    likes: 67,
    replies: 23,
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
];

export const mockCommentary: CommentaryBall[] = [
  { id: '1', over: '43.6', ball: 6, runs: 1, isWicket: false, isBoundary: false, isSix: false, description: 'Kohli works it to deep midwicket for a single. India 241/4', timestamp: new Date().toISOString() },
  { id: '2', over: '43.5', ball: 5, runs: 4, isWicket: false, isBoundary: true, isSix: false, description: 'FOUR! Kohli punches it through covers. Exquisite timing. The ball races away to the boundary.', timestamp: new Date().toISOString() },
  { id: '3', over: '43.4', ball: 4, runs: 0, isWicket: false, isBoundary: false, isSix: false, description: 'Defended back to the bowler. Starc is testing Kohli with good length deliveries.', timestamp: new Date().toISOString() },
  { id: '4', over: '43.3', ball: 3, runs: 1, isWicket: false, isBoundary: false, isSix: false, description: 'Worked away for a single to fine leg. Rahul on strike now.', timestamp: new Date().toISOString() },
  { id: '5', over: '43.2', ball: 2, runs: 0, isWicket: false, isBoundary: false, isSix: false, description: 'Good length, angling in. Kohli shoulders arms, the ball goes past off stump.', timestamp: new Date().toISOString() },
  { id: '6', over: '43.1', ball: 1, runs: 2, isWicket: false, isBoundary: false, isSix: false, description: 'Flicked off the pads to deep square leg. Easy two runs.', timestamp: new Date().toISOString() },
];

export const mockScorecard: FullScorecard = {
  innings: 1,
  team: { id: 'aus', name: 'Australia', shortName: 'AUS' },
  batting: [
    { batsman: 'D Warner', dismissal: 'c Rahul b Bumrah', runs: 45, balls: 52, fours: 6, sixes: 1, strikeRate: 86.54 },
    { batsman: 'T Head', dismissal: 'lbw b Shami', runs: 78, balls: 89, fours: 9, sixes: 2, strikeRate: 87.64 },
    { batsman: 'M Labuschagne', dismissal: 'c Kohli b Jadeja', runs: 32, balls: 41, fours: 3, sixes: 0, strikeRate: 78.05 },
    { batsman: 'S Smith', dismissal: 'b Bumrah', runs: 67, balls: 78, fours: 5, sixes: 1, strikeRate: 85.90 },
    { batsman: 'M Marsh', dismissal: 'c Iyer b Kuldeep', runs: 23, balls: 28, fours: 2, sixes: 0, strikeRate: 82.14 },
    { batsman: 'G Maxwell', dismissal: 'c Rahul b Shami', runs: 18, balls: 12, fours: 1, sixes: 2, strikeRate: 150.00 },
    { batsman: 'A Carey (wk)', dismissal: 'not out', runs: 12, balls: 15, fours: 1, sixes: 0, strikeRate: 80.00 },
    { batsman: 'P Cummins (c)', dismissal: 'c Jadeja b Bumrah', runs: 5, balls: 8, fours: 0, sixes: 0, strikeRate: 62.50 },
    { batsman: 'M Starc', dismissal: 'run out (Jadeja)', runs: 3, balls: 5, fours: 0, sixes: 0, strikeRate: 60.00 },
    { batsman: 'J Hazlewood', dismissal: 'not out', runs: 1, balls: 3, fours: 0, sixes: 0, strikeRate: 33.33 },
    { batsman: 'A Zampa', dismissal: 'did not bat', runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0 },
  ],
  bowling: [
    { bowler: 'J Bumrah', overs: '10.0', maidens: 2, runs: 48, wickets: 3, economy: 4.80, wides: 1, noBalls: 0 },
    { bowler: 'M Shami', overs: '10.0', maidens: 1, runs: 56, wickets: 2, economy: 5.60, wides: 2, noBalls: 0 },
    { bowler: 'R Jadeja', overs: '10.0', maidens: 0, runs: 52, wickets: 1, economy: 5.20, wides: 0, noBalls: 0 },
    { bowler: 'K Yadav', overs: '10.0', maidens: 0, runs: 61, wickets: 1, economy: 6.10, wides: 1, noBalls: 1 },
    { bowler: 'H Pandya', overs: '10.0', maidens: 0, runs: 64, wickets: 0, economy: 6.40, wides: 0, noBalls: 0 },
  ],
  extras: { byes: 2, legByes: 4, wides: 4, noBalls: 1, penalties: 0, total: 11 },
  total: { runs: 287, wickets: 8, overs: '50.0' },
  fallOfWickets: ['1-67 (Warner)', '2-132 (Labuschagne)', '3-178 (Head)', '4-218 (Marsh)', '5-245 (Maxwell)', '6-267 (Smith)', '7-278 (Cummins)', '8-284 (Starc)'],
};

// API simulation functions
export const fetchLiveMatches = async (): Promise<Match[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockMatches.filter(m => m.status === 'LIVE');
};

export const fetchAllMatches = async (): Promise<Match[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockMatches;
};

export const fetchMatchById = async (id: string): Promise<Match | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockMatches.find(m => m.id === id);
};

export const fetchNews = async (): Promise<NewsItem[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return mockNews;
};

export const fetchDiscussions = async (matchId?: string): Promise<DiscussionPost[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  if (matchId) {
    return mockDiscussions.filter(d => d.matchId === matchId);
  }
  return mockDiscussions;
};

export const fetchCommentary = async (matchId: string): Promise<CommentaryBall[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockCommentary;
};

export const fetchScorecard = async (matchId: string): Promise<FullScorecard> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockScorecard;
};
