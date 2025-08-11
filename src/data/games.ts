import { GameMeta } from '../types';

export const GAMES: GameMeta[] = [
  {
    id: 'talkDice',
    name: 'Talk Dice（話題サイコロ）',
    minPlayers: 2,
    maxPlayers: 6,
    mood: ['relax', 'party'],
    style: 'coop',
    cognition: 'low',
    estimatedTime: '5-10分',
  },
  {
    id: 'ito',
    name: 'Ito（簡易版）',
    minPlayers: 3,
    maxPlayers: 6,
    mood: ['relax', 'serious'],
    style: 'coop',
    cognition: 'medium',
    estimatedTime: '10-15分',
  },
  {
    id: 'insider',
    name: 'Insider（内通者）',
    minPlayers: 4,
    maxPlayers: 6,
    mood: ['party', 'serious'],
    style: 'competitive',
    cognition: 'high',
    estimatedTime: '10-15分',
  },
];
