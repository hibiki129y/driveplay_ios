import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeButton } from '../../components/SafeButton';
import { SafetyWarning } from '../../components/SafetyWarning';
import { useGameStore } from '../../store/gameStore';
import { RootStackParamList } from '../../navigation/AppNavigator';

import talkTopics from '../../../assets/data/talk_topics.json';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'TalkDice'>;

export const TalkDiceScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { talkDiceState, setTalkDiceState } = useGameStore();
  
  const [showWarning, setShowWarning] = useState(true);
  const [currentTopic, setCurrentTopic] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [customTopics, setCustomTopics] = useState<string[]>([]);

  useEffect(() => {
    if (talkDiceState) {
      setCurrentTopic(talkDiceState.currentTopic);
      setHistory(talkDiceState.history);
      setFavorites(talkDiceState.favorites);
    } else {
      getRandomTopic();
    }
  }, []);

  useEffect(() => {
    setTalkDiceState({
      currentTopic,
      history,
      favorites,
    });
  }, [currentTopic, history, favorites]);

  const getRandomTopic = () => {
    const allTopics = [...talkTopics, ...customTopics];
    const availableTopics = allTopics.filter(topic => !history.includes(topic));
    
    if (availableTopics.length === 0) {
      setHistory([]);
      const randomTopic = allTopics[Math.floor(Math.random() * allTopics.length)];
      setCurrentTopic(randomTopic);
      setHistory([randomTopic]);
    } else {
      const randomTopic = availableTopics[Math.floor(Math.random() * availableTopics.length)];
      setCurrentTopic(randomTopic);
      setHistory(prev => [randomTopic, ...prev.slice(0, 9)]); // Keep last 10
    }
  };

  const handleNextTopic = () => {
    getRandomTopic();
  };

  const handlePreviousTopic = () => {
    if (history.length > 1) {
      const previousTopic = history[1];
      setCurrentTopic(previousTopic);
      setHistory(prev => [previousTopic, ...prev.filter(t => t !== previousTopic)]);
    }
  };

  const handleToggleFavorite = () => {
    if (favorites.includes(currentTopic)) {
      setFavorites(prev => prev.filter(t => t !== currentTopic));
    } else {
      setFavorites(prev => [...prev, currentTopic]);
    }
  };

  const handleAddCustomTopic = () => {
    Alert.prompt(
      'カスタムお題追加',
      'お題を入力してください',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '追加',
          onPress: (text) => {
            if (text && text.trim()) {
              setCustomTopics(prev => [...prev, text.trim()]);
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const handleHome = () => {
    navigation.navigate('Home');
  };

  const handleWarningAccept = () => {
    setShowWarning(false);
  };

  const isFavorite = favorites.includes(currentTopic);
  const canGoBack = history.length > 1;

  return (
    <SafeAreaView style={styles.container}>
      <SafetyWarning
        visible={showWarning}
        onAccept={handleWarningAccept}
        title="Talk Dice - 安全運転のお願い"
        message="運転手の方は操作をしないでください。&#10;同乗者の方が操作してください。"
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Talk Dice</Text>
        <Text style={styles.subtitle}>話題サイコロ</Text>

        <View style={styles.topicCard}>
          <Text style={styles.topicText}>{currentTopic}</Text>
        </View>

        <View style={styles.buttonGrid}>
          <SafeButton
            title="次のお題"
            onPress={handleNextTopic}
            variant="primary"
            size="large"
            style={styles.actionButton}
          />
          
          <SafeButton
            title="戻る"
            onPress={handlePreviousTopic}
            disabled={!canGoBack}
            variant="secondary"
            size="large"
            style={styles.actionButton}
          />
        </View>

        <View style={styles.buttonGrid}>
          <SafeButton
            title={isFavorite ? "★ お気に入り済み" : "☆ お気に入り"}
            onPress={handleToggleFavorite}
            variant={isFavorite ? "success" : "secondary"}
            size="medium"
            style={styles.actionButton}
          />
          
          <SafeButton
            title="カスタムお題追加"
            onPress={handleAddCustomTopic}
            variant="secondary"
            size="medium"
            style={styles.actionButton}
          />
        </View>

        {history.length > 1 && (
          <View style={styles.historySection}>
            <Text style={styles.historyTitle}>履歴</Text>
            {history.slice(1, 6).map((topic, index) => (
              <Text key={index} style={styles.historyItem}>
                {topic}
              </Text>
            ))}
          </View>
        )}

        {favorites.length > 0 && (
          <View style={styles.favoritesSection}>
            <Text style={styles.favoritesTitle}>お気に入り</Text>
            {favorites.slice(0, 5).map((topic, index) => (
              <Text key={index} style={styles.favoriteItem}>
                ★ {topic}
              </Text>
            ))}
          </View>
        )}

        <SafeButton
          title="ホームに戻る"
          onPress={handleHome}
          variant="danger"
          size="large"
          style={styles.homeButton}
        />
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
  subtitle: {
    fontSize: 18,
    color: '#CBD5E1',
    textAlign: 'center',
    marginBottom: 32,
  },
  topicCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 32,
    marginBottom: 32,
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topicText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#F8FAFC',
    textAlign: 'center',
    lineHeight: 36,
  },
  buttonGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
  },
  historySection: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    marginBottom: 16,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 12,
  },
  historyItem: {
    fontSize: 16,
    color: '#CBD5E1',
    marginBottom: 8,
    paddingLeft: 8,
  },
  favoritesSection: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  favoritesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 12,
  },
  favoriteItem: {
    fontSize: 16,
    color: '#22C55E',
    marginBottom: 8,
    paddingLeft: 8,
  },
  homeButton: {
    marginTop: 32,
  },
});
