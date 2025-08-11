import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';
import { Player, RecommendationCriteria, GameMeta, InsiderState, ItoState, TalkDiceState } from '../types';

const storage = new MMKV();

const zustandStorage = {
  setItem: (name: string, value: string) => {
    return storage.set(name, value);
  },
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name: string) => {
    return storage.delete(name);
  },
};

interface GameStore {
  players: Player[];
  playerCount: number;
  setPlayers: (players: Player[]) => void;
  setPlayerCount: (count: number) => void;
  
  currentGame: string | null;
  insiderState: InsiderState | null;
  itoState: ItoState | null;
  talkDiceState: TalkDiceState | null;
  
  setCurrentGame: (gameId: string | null) => void;
  setInsiderState: (state: InsiderState | null) => void;
  setItoState: (state: ItoState | null) => void;
  setTalkDiceState: (state: TalkDiceState | null) => void;
  
  lastRecommendation: RecommendationCriteria | null;
  setLastRecommendation: (criteria: RecommendationCriteria | null) => void;
  
  roomCode: string | null;
  isMultiDevice: boolean;
  setRoomCode: (code: string | null) => void;
  setIsMultiDevice: (enabled: boolean) => void;
  
  resetGameState: () => void;
  resetAll: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      players: [],
      playerCount: 2,
      currentGame: null,
      insiderState: null,
      itoState: null,
      talkDiceState: null,
      lastRecommendation: null,
      roomCode: null,
      isMultiDevice: false,
      
      setPlayers: (players) => set({ players }),
      setPlayerCount: (count) => set({ playerCount: count }),
      
      setCurrentGame: (gameId) => set({ currentGame: gameId }),
      setInsiderState: (state) => set({ insiderState: state }),
      setItoState: (state) => set({ itoState: state }),
      setTalkDiceState: (state) => set({ talkDiceState: state }),
      
      setLastRecommendation: (criteria) => set({ lastRecommendation: criteria }),
      
      setRoomCode: (code) => set({ roomCode: code }),
      setIsMultiDevice: (enabled) => set({ isMultiDevice: enabled }),
      
      resetGameState: () => set({
        currentGame: null,
        insiderState: null,
        itoState: null,
        talkDiceState: null,
      }),
      
      resetAll: () => set({
        players: [],
        playerCount: 2,
        currentGame: null,
        insiderState: null,
        itoState: null,
        talkDiceState: null,
        lastRecommendation: null,
        roomCode: null,
        isMultiDevice: false,
      }),
    }),
    {
      name: 'driveplay-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
