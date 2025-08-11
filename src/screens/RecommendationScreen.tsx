import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeButton } from '../components/SafeButton';
import { useGameStore } from '../store/gameStore';
import { calculateGameRecommendations, getMoodLabel, getStyleLabel, getCognitionLabel } from '../utils/recommendation';
import { Mood, Style, Cognition, RecommendationCriteria, GameMeta } from '../types';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Recommendation'>;

export const RecommendationScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { playerCount, setLastRecommendation, resetGameState } = useGameStore();
  
  const [mood, setMood] = useState<Mood>('party');
  const [style, setStyle] = useState<Style>('coop');
  const [cognition, setCognition] = useState<Cognition>('medium');
  const [recommendations, setRecommendations] = useState<GameMeta[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleGetRecommendations = () => {
    const criteria: RecommendationCriteria = {
      playerCount,
      mood,
      style,
      cognition,
    };
    
    const results = calculateGameRecommendations(criteria);
    setRecommendations(results);
    setLastRecommendation(criteria);
    setShowResults(true);
  };

  const handleGameSelect = (gameId: string) => {
    resetGameState();
    switch (gameId) {
      case 'talkDice':
        navigation.navigate('TalkDice');
        break;
      case 'ito':
        navigation.navigate('Ito');
        break;
      case 'insider':
        navigation.navigate('Insider');
        break;
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const moods: Mood[] = ['relax', 'party', 'serious'];
  const styles: Style[] = ['coop', 'competitive'];
  const cognitions: Cognition[] = ['low', 'medium', 'high'];

  if (showResults) {
    return (
      <SafeAreaView style={stylesScreen.container}>
        <ScrollView style={stylesScreen.content}>
          <Text style={stylesScreen.title}>おすすめゲーム</Text>
          <Text style={stylesScreen.subtitle}>
            {playerCount}人 • {getMoodLabel(mood)} • {getStyleLabel(style)} • {getCognitionLabel(cognition)}
          </Text>

          {recommendations.length > 0 ? (
            recommendations.map((game, index) => (
              <View key={game.id} style={stylesScreen.gameCard}>
                <View style={stylesScreen.rankBadge}>
                  <Text style={stylesScreen.rankText}>{index + 1}</Text>
                </View>
                <Text style={stylesScreen.gameName}>{game.name}</Text>
                <Text style={stylesScreen.gameInfo}>
                  {game.minPlayers}-{game.maxPlayers}人 • {game.estimatedTime}
                </Text>
                <SafeButton
                  title="このゲームで遊ぶ"
                  onPress={() => handleGameSelect(game.id)}
                  variant="primary"
                  size="medium"
                  style={stylesScreen.gameButton}
                />
              </View>
            ))
          ) : (
            <View style={stylesScreen.noResults}>
              <Text style={stylesScreen.noResultsText}>
                条件に合うゲームが見つかりませんでした
              </Text>
            </View>
          )}

          <SafeButton
            title="条件を変更"
            onPress={() => setShowResults(false)}
            variant="secondary"
            size="medium"
            style={stylesScreen.backButton}
          />
          
          <SafeButton
            title="ホームに戻る"
            onPress={handleBack}
            variant="secondary"
            size="medium"
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={stylesScreen.container}>
      <ScrollView style={stylesScreen.content}>
        <Text style={stylesScreen.title}>ゲーム診断</Text>
        <Text style={stylesScreen.subtitle}>
          あなたの気分に合うゲームを見つけましょう
        </Text>

        <View style={stylesScreen.section}>
          <Text style={stylesScreen.sectionTitle}>気分・雰囲気</Text>
          <View style={stylesScreen.optionGrid}>
            {moods.map((m) => (
              <SafeButton
                key={m}
                title={getMoodLabel(m)}
                onPress={() => setMood(m)}
                variant={mood === m ? "primary" : "secondary"}
                size="medium"
                style={stylesScreen.optionButton}
              />
            ))}
          </View>
        </View>

        <View style={stylesScreen.section}>
          <Text style={stylesScreen.sectionTitle}>プレイスタイル</Text>
          <View style={stylesScreen.optionGrid}>
            {styles.map((s) => (
              <SafeButton
                key={s}
                title={getStyleLabel(s)}
                onPress={() => setStyle(s)}
                variant={style === s ? "primary" : "secondary"}
                size="medium"
                style={stylesScreen.optionButton}
              />
            ))}
          </View>
        </View>

        <View style={stylesScreen.section}>
          <Text style={stylesScreen.sectionTitle}>考える度合い</Text>
          <View style={stylesScreen.optionGrid}>
            {cognitions.map((c) => (
              <SafeButton
                key={c}
                title={getCognitionLabel(c)}
                onPress={() => setCognition(c)}
                variant={cognition === c ? "primary" : "secondary"}
                size="medium"
                style={stylesScreen.optionButton}
              />
            ))}
          </View>
        </View>

        <SafeButton
          title="おすすめを見る"
          onPress={handleGetRecommendations}
          variant="success"
          size="large"
          style={stylesScreen.recommendButton}
        />

        <SafeButton
          title="戻る"
          onPress={handleBack}
          variant="secondary"
          size="medium"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const stylesScreen = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F8FAFC',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#CBD5E1',
    textAlign: 'center',
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 16,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionButton: {
    flex: 1,
    minWidth: 100,
  },
  recommendButton: {
    marginBottom: 16,
  },
  gameCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    position: 'relative',
  },
  rankBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#61D4D4',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  gameName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 8,
    paddingRight: 40,
  },
  gameInfo: {
    fontSize: 16,
    color: '#CBD5E1',
    marginBottom: 16,
  },
  gameButton: {
    alignSelf: 'stretch',
  },
  noResults: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginBottom: 16,
  },
  noResultsText: {
    fontSize: 18,
    color: '#CBD5E1',
    textAlign: 'center',
  },
  backButton: {
    marginBottom: 16,
  },
});
