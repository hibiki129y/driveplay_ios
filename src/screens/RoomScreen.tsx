import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeButton } from '../components/SafeButton';
import { useGameStore } from '../store/gameStore';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Room'>;

export const RoomScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { setRoomCode, setIsMultiDevice } = useGameStore();
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const generateRoomCode = (): string => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateRoom = async () => {
    setIsCreating(true);
    try {
      const code = generateRoomCode();
      setRoomCode(code);
      setIsMultiDevice(true);
      
      Alert.alert(
        'ルーム作成完了',
        `ルームコード: ${code}\n\n他の参加者にこのコードを伝えてください。`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('エラー', 'ルームの作成に失敗しました。');
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinRoom = async () => {
    if (roomCodeInput.length !== 6) {
      Alert.alert('エラー', '6桁のルームコードを入力してください。');
      return;
    }

    try {
      setRoomCode(roomCodeInput.toUpperCase());
      setIsMultiDevice(true);
      
      Alert.alert(
        'ルーム参加完了',
        `ルーム ${roomCodeInput.toUpperCase()} に参加しました。`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('エラー', 'ルームへの参加に失敗しました。');
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>マルチ端末プレイ（β）</Text>
        <Text style={styles.subtitle}>
          複数の端末で同期してゲームを楽しめます
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>新しいルームを作成</Text>
          <Text style={styles.description}>
            ルームを作成して、他の参加者を招待しましょう
          </Text>
          <SafeButton
            title={isCreating ? "作成中..." : "ルーム作成"}
            onPress={handleCreateRoom}
            disabled={isCreating}
            variant="primary"
            size="large"
            style={styles.button}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>既存のルームに参加</Text>
          <Text style={styles.description}>
            6桁のルームコードを入力してください
          </Text>
          <TextInput
            style={styles.input}
            value={roomCodeInput}
            onChangeText={setRoomCodeInput}
            placeholder="ABCDEF"
            placeholderTextColor="#64748B"
            maxLength={6}
            autoCapitalize="characters"
            autoCorrect={false}
          />
          <SafeButton
            title="ルーム参加"
            onPress={handleJoinRoom}
            disabled={roomCodeInput.length !== 6}
            variant="success"
            size="large"
            style={styles.button}
          />
        </View>

        <SafeButton
          title="戻る"
          onPress={handleBack}
          variant="secondary"
          size="medium"
          style={styles.backButton}
        />

        <View style={styles.notice}>
          <Text style={styles.noticeText}>
            ⚠️ β機能のため、接続が不安定な場合があります。
            問題が発生した場合は、シングル端末モードをご利用ください。
          </Text>
        </View>
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
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#CBD5E1',
    marginBottom: 20,
    lineHeight: 24,
  },
  input: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    color: '#F8FAFC',
    marginBottom: 20,
    minHeight: 56,
    textAlign: 'center',
    letterSpacing: 2,
  },
  button: {
    marginBottom: 16,
  },
  backButton: {
    marginTop: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 32,
  },
  notice: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    marginTop: 32,
  },
  noticeText: {
    fontSize: 14,
    color: '#CBD5E1',
    textAlign: 'center',
    lineHeight: 20,
  },
});
