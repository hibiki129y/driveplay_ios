import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ScreenOrientation from 'expo-screen-orientation';
import { SafeButton } from '../components/SafeButton';
import { SafetyWarning } from '../components/SafetyWarning';
import { useGameStore } from '../store/gameStore';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

export const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { playerCount, setPlayerCount, players, setPlayers } = useGameStore();
  const [showWarning, setShowWarning] = useState(true);
  const [tempPlayerCount, setTempPlayerCount] = useState(playerCount.toString());
  const [playerNames, setPlayerNames] = useState<string[]>(
    Array.from({ length: 6 }, (_, i) => players[i]?.name || '')
  );

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  }, []);

  const handleWarningAccept = () => {
    setShowWarning(false);
  };

  const handlePlayerCountChange = (text: string) => {
    setTempPlayerCount(text);
    const count = parseInt(text);
    if (count >= 2 && count <= 6) {
      setPlayerCount(count);
    }
  };

  const handlePlayerNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleContinue = () => {
    const count = parseInt(tempPlayerCount);
    if (count >= 2 && count <= 6) {
      const newPlayers = Array.from({ length: count }, (_, i) => ({
        id: `player-${i + 1}`,
        name: playerNames[i] || `プレイヤー${i + 1}`,
      }));
      setPlayers(newPlayers);
      navigation.navigate('Home');
    }
  };

  const isValidPlayerCount = () => {
    const count = parseInt(tempPlayerCount);
    return count >= 2 && count <= 6;
  };

  return (
    <SafeAreaView style={styles.container}>
      <SafetyWarning
        visible={showWarning}
        onAccept={handleWarningAccept}
        title="安全運転のお願い"
        message="運転手の方は操作をしないでください。&#10;同乗者の方が操作してください。&#10;&#10;ドライブを安全に楽しみましょう！"
      />
      
      <View style={styles.content}>
        <Text style={styles.title}>DrivePlay</Text>
        <Text style={styles.subtitle}>ドライブを盛り上げるゲーム集</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>プレイヤー人数</Text>
          <TextInput
            style={styles.input}
            value={tempPlayerCount}
            onChangeText={handlePlayerCountChange}
            keyboardType="numeric"
            maxLength={1}
            placeholder="2-6"
            placeholderTextColor="#64748B"
          />
          <Text style={styles.hint}>2〜6人で遊べます</Text>
        </View>

        {isValidPlayerCount() && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>プレイヤー名（任意）</Text>
            {Array.from({ length: parseInt(tempPlayerCount) }, (_, i) => (
              <TextInput
                key={i}
                style={styles.input}
                value={playerNames[i]}
                onChangeText={(text) => handlePlayerNameChange(i, text)}
                placeholder={`プレイヤー${i + 1}`}
                placeholderTextColor="#64748B"
                maxLength={20}
              />
            ))}
          </View>
        )}

        <SafeButton
          title="ゲームを始める"
          onPress={handleContinue}
          disabled={!isValidPlayerCount()}
          variant="primary"
          size="large"
          style={styles.continueButton}
        />
      </View>
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
    justifyContent: 'center',
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
    marginBottom: 48,
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
  input: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    color: '#F8FAFC',
    marginBottom: 12,
    minHeight: 56,
  },
  hint: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
  continueButton: {
    marginTop: 32,
  },
});
