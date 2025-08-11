import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeButton } from '../components/SafeButton';
import { useGameStore } from '../store/gameStore';
import { GAMES } from '../data/games';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { players, playerCount, resetGameState } = useGameStore();

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

  const handleRecommendation = () => {
    navigation.navigate('Recommendation');
  };

  const handleMultiDevice = () => {
    navigation.navigate('Room', {});
  };

  const getGameAvailability = (game: typeof GAMES[0]) => {
    return playerCount >= game.minPlayers && playerCount <= game.maxPlayers;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>DrivePlay</Text>
        <Text style={styles.playerInfo}>
          {playerCount}人でプレイ ({players.map(p => p.name).join(', ')})
        </Text>

        <View style={styles.section}>
          <SafeButton
            title="🎲 おすすめゲーム"
            onPress={handleRecommendation}
            variant="primary"
            size="large"
            style={styles.recommendButton}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ゲーム一覧</Text>
          {GAMES.map((game) => {
            const isAvailable = getGameAvailability(game);
            return (
              <View key={game.id} style={styles.gameCard}>
                <Text style={styles.gameName}>{game.name}</Text>
                <Text style={styles.gameInfo}>
                  {game.minPlayers}-{game.maxPlayers}人 • {game.estimatedTime}
                </Text>
                <SafeButton
                  title={isAvailable ? "開始" : `${game.minPlayers}-${game.maxPlayers}人必要`}
                  onPress={() => handleGameSelect(game.id)}
                  disabled={!isAvailable}
                  variant={isAvailable ? "success" : "secondary"}
                  size="medium"
                  style={styles.gameButton}
                />
              </View>
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>マルチ端末プレイ（β）</Text>
          <SafeButton
            title="ルーム作成・参加"
            onPress={handleMultiDevice}
            variant="secondary"
            size="medium"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  playerInfo: {
    fontSize: 16,
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
  recommendButton: {
    marginBottom: 16,
  },
  gameCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  gameName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 8,
  },
  gameInfo: {
    fontSize: 16,
    color: '#CBD5E1',
    marginBottom: 16,
  },
  gameButton: {
    alignSelf: 'stretch',
  },
});
