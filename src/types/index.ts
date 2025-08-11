export type Mood = 'relax' | 'party' | 'serious';
export type Style = 'coop' | 'competitive';
export type Cognition = 'low' | 'medium' | 'high';

export interface GameMeta {
  id: 'talkDice' | 'ito' | 'insider';
  name: string;
  minPlayers: number;
  maxPlayers: number;
  mood: Mood[];
  style: Style;
  cognition: Cognition;
  estimatedTime: string;
}

export interface Player {
  id: string;
  name: string;
}

export interface RecommendationCriteria {
  playerCount: number;
  mood: Mood;
  style: Style;
  cognition: Cognition;
}

export type Role = 'MASTER' | 'INSIDER' | 'CITIZEN';

export interface InsiderState {
  phase: 'assign' | 'question' | 'discuss' | 'accuse' | 'result';
  players: { id: string; name: string; role?: Role }[];
  candidates: string[];
  answerIndex?: number;
  questionSeconds: number;
  discussSeconds: number;
  votes?: Record<string, string>;
  result?: { winner: 'citizens' | 'insider'; accusedId?: string };
}

export interface ItoState {
  theme: string;
  numbers: Record<string, number>;
  hints: Record<string, string>;
  order: string[];
}

export interface TalkDiceState {
  currentTopic: string;
  history: string[];
  favorites: string[];
}

export interface RoomState {
  id: string;
  code: string;
  gameState: InsiderState | ItoState | TalkDiceState | null;
  participants: string[];
}
