import { calculateGameRecommendations } from '../recommendation';
import { GAMES } from '../../data/games';

describe('Game Recommendation System', () => {
  test('should recommend games based on player count', () => {
    const recommendations = calculateGameRecommendations({
      playerCount: 3,
      mood: 'party',
      style: 'coop',
      cognition: 'medium'
    });

    expect(recommendations).toHaveLength(3);
    expect(Array.isArray(recommendations)).toBe(true);
    recommendations.forEach(game => {
      expect(game).toHaveProperty('id');
      expect(game).toHaveProperty('name');
      expect(game).toHaveProperty('minPlayers');
      expect(game).toHaveProperty('maxPlayers');
    });
  });

  test('should handle edge case with 2 players', () => {
    const recommendations = calculateGameRecommendations({
      playerCount: 2,
      mood: 'relax',
      style: 'competitive',
      cognition: 'low'
    });

    expect(recommendations).toHaveLength(3);
    recommendations.forEach(game => {
      expect(game.minPlayers).toBeLessThanOrEqual(2);
      expect(game.maxPlayers).toBeGreaterThanOrEqual(2);
    });
  });

  test('should handle edge case with 6 players', () => {
    const recommendations = calculateGameRecommendations({
      playerCount: 6,
      mood: 'serious',
      style: 'coop',
      cognition: 'high'
    });

    expect(recommendations).toHaveLength(3);
    recommendations.forEach(game => {
      expect(game.minPlayers).toBeLessThanOrEqual(6);
      expect(game.maxPlayers).toBeGreaterThanOrEqual(6);
    });
  });

  test('should return valid games for valid player count', () => {
    const recommendations = calculateGameRecommendations({
      playerCount: 4,
      mood: 'party',
      style: 'competitive',
      cognition: 'medium'
    });

    expect(recommendations.length).toBeGreaterThan(0);
    recommendations.forEach(game => {
      expect(game.minPlayers).toBeLessThanOrEqual(4);
      expect(game.maxPlayers).toBeGreaterThanOrEqual(4);
    });
  });

  test('should return all available games when no perfect match', () => {
    const recommendations = calculateGameRecommendations({
      playerCount: 3,
      mood: 'relax',
      style: 'coop',
      cognition: 'low'
    });

    expect(recommendations).toHaveLength(3);
    expect(recommendations.every(game => GAMES.includes(game))).toBe(true);
  });
});
