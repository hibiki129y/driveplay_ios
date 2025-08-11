import { useGameStore } from '../gameStore';

describe('Game Store', () => {
  beforeEach(() => {
    useGameStore.getState().resetGameState();
  });

  test('should initialize with default state', () => {
    const state = useGameStore.getState();
    expect(state.players).toEqual([]);
    expect(state.playerCount).toBe(0);
    expect(state.currentGame).toBeNull();
  });

  test('should set players correctly', () => {
    const players = [
      { id: '1', name: 'Player 1' },
      { id: '2', name: 'Player 2' }
    ];
    
    useGameStore.getState().setPlayers(players);
    const state = useGameStore.getState();
    
    expect(state.players).toEqual(players);
    expect(state.playerCount).toBe(2);
  });

  test('should set current game', () => {
    useGameStore.getState().setCurrentGame('talkDice');
    const state = useGameStore.getState();
    
    expect(state.currentGame).toBe('talkDice');
  });

  test('should reset game state', () => {
    const players = [{ id: '1', name: 'Test' }];
    useGameStore.getState().setPlayers(players);
    useGameStore.getState().setCurrentGame('ito');
    
    useGameStore.getState().resetGameState();
    const state = useGameStore.getState();
    
    expect(state.players).toEqual([]);
    expect(state.playerCount).toBe(0);
    expect(state.currentGame).toBeNull();
  });

  test('should update insider game state', () => {
    const insiderState = {
      phase: 'assign' as const,
      players: [{ id: '1', name: 'Player 1' }],
      candidates: ['word1', 'word2', 'word3', 'word4', 'word5', 'word6'],
      questionSeconds: 180,
      discussSeconds: 180
    };
    
    useGameStore.getState().setInsiderState(insiderState);
    const state = useGameStore.getState();
    
    expect(state.insiderState).toEqual(insiderState);
  });

  test('should update ito game state', () => {
    const itoState = {
      theme: 'Test Theme',
      numbers: { '1': 50 },
      hints: { '1': 'Test hint' },
      order: ['1']
    };
    
    useGameStore.getState().setItoState(itoState);
    const state = useGameStore.getState();
    
    expect(state.itoState).toEqual(itoState);
  });
});
