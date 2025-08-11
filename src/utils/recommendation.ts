import { GameMeta, RecommendationCriteria, Mood, Style, Cognition } from '../types';
import { GAMES } from '../data/games';

interface GameScore {
  game: GameMeta;
  score: number;
  reasons: string[];
}

export function calculateGameRecommendations(criteria: RecommendationCriteria): GameMeta[] {
  const scores: GameScore[] = GAMES.map(game => {
    let score = 0;
    const reasons: string[] = [];
    
    if (criteria.playerCount >= game.minPlayers && criteria.playerCount <= game.maxPlayers) {
      score += 2;
      reasons.push('人数適合');
    }
    
    if (game.mood.includes(criteria.mood)) {
      score += 1;
      reasons.push('雰囲気適合');
    }
    
    if (game.style === criteria.style) {
      score += 1;
      reasons.push('スタイル適合');
    }
    
    if (game.cognition === criteria.cognition) {
      score += 1;
      reasons.push('認知負荷適合');
    }
    
    return { game, score, reasons };
  });
  
  scores.sort((a, b) => b.score - a.score);
  
  if (scores[0].score === 0) {
    return relaxConditionsAndRecommend(criteria);
  }
  
  return scores.slice(0, 3).map(s => s.game);
}

function relaxConditionsAndRecommend(criteria: RecommendationCriteria): GameMeta[] {
  let relaxedCriteria = { ...criteria };
  
  const cognitionOptions: Cognition[] = ['low', 'medium', 'high'];
  for (const cognition of cognitionOptions) {
    if (cognition !== criteria.cognition) {
      relaxedCriteria.cognition = cognition;
      const results = calculateGameRecommendations(relaxedCriteria);
      if (results.length > 0) return results;
    }
  }
  
  relaxedCriteria = { ...criteria };
  const styleOptions: Style[] = ['coop', 'competitive'];
  for (const style of styleOptions) {
    if (style !== criteria.style) {
      relaxedCriteria.style = style;
      const results = calculateGameRecommendations(relaxedCriteria);
      if (results.length > 0) return results;
    }
  }
  
  relaxedCriteria = { ...criteria };
  const moodOptions: Mood[] = ['relax', 'party', 'serious'];
  for (const mood of moodOptions) {
    if (mood !== criteria.mood) {
      relaxedCriteria.mood = mood;
      const results = calculateGameRecommendations(relaxedCriteria);
      if (results.length > 0) return results;
    }
  }
  
  return GAMES.filter(game => 
    criteria.playerCount >= game.minPlayers && 
    criteria.playerCount <= game.maxPlayers
  ).slice(0, 3);
}

export function getMoodLabel(mood: Mood): string {
  switch (mood) {
    case 'relax': return 'リラックス';
    case 'party': return 'パーティー';
    case 'serious': return 'シリアス';
  }
}

export function getStyleLabel(style: Style): string {
  switch (style) {
    case 'coop': return '協力';
    case 'competitive': return '競争';
  }
}

export function getCognitionLabel(cognition: Cognition): string {
  switch (cognition) {
    case 'low': return '軽め';
    case 'medium': return '普通';
    case 'high': return '重め';
  }
}
