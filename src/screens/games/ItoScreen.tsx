import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeButton } from '../../components/SafeButton';
import { SafetyWarning } from '../../components/SafetyWarning';
import { useGameStore } from '../../store/gameStore';
import { ItoState } from '../../types';
import { RootStackParamList } from '../../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Ito'>;

const PRESET_THEMES = [
  '大きさ', '重さ', '速さ', '高さ', '美しさ', '人気度', '難しさ', '楽しさ', '怖さ', '暖かさ'
];

export const ItoScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { players, itoState, setItoState } = useGameStore();
  
  const [showWarning, setShowWarning] = useState(true);
  const [phase, setPhase] = useState<'setup' | 'numbers' | 'hints' | 'order' | 'result'>('setup');
  const [theme, setTheme] = useState('');
  const [customTheme, setCustomTheme] = useState('');
  const [numbers, setNumbers] = useState<Record<string, number>>({});
  const [hints, setHints] = useState<Record<string, string>>({});
  const [order, setOrder] = useState<string[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  useEffect(() => {
    if (itoState) {
      setTheme(itoState.theme);
      setNumbers(itoState.numbers);
      setHints(itoState.hints);
      setOrder(itoState.order);
      if (Object.keys(itoState.numbers).length === 0) {
        setPhase('setup');
      } else if (Object.keys(itoState.hints).length < players.length) {
        setPhase('hints');
      } else if (itoState.order.length === 0) {
        setPhase('order');
      } else {
        setPhase('result');
      }
    }
  }, []);

  useEffect(() => {
    setItoState({
      theme,
      numbers,
      hints,
      order,
    });
  }, [theme, numbers, hints, order]);

  const handleWarningAccept = () => {
    setShowWarning(false);
  };

  const handleThemeSelect = (selectedTheme: string) => {
    setTheme(selectedTheme);
  };

  const handleCustomTheme = () => {
    if (customTheme.trim()) {
      setTheme(customTheme.trim());
    }
  };

  const handleStartGame = () => {
    if (!theme) {
      Alert.alert('エラー', 'テーマを選択してください。');
      return;
    }

    const usedNumbers = new Set<number>();
    const newNumbers: Record<string, number> = {};
    
    players.forEach(player => {
      let randomNumber;
      do {
        randomNumber = Math.floor(Math.random() * 100) + 1;
      } while (usedNumbers.has(randomNumber));
      
      usedNumbers.add(randomNumber);
      newNumbers[player.id] = randomNumber;
    });

    setNumbers(newNumbers);
    setPhase('numbers');
    setCurrentPlayerIndex(0);
  };

  const handleNextPlayer = () => {
    if (currentPlayerIndex < players.length - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
    } else {
      setPhase('hints');
      setCurrentPlayerIndex(0);
    }
  };

  const handleHintSubmit = (playerId: string, hint: string) => {
    if (!hint.trim()) {
      Alert.alert('エラー', 'ヒントを入力してください。');
      return;
    }

    const existingHints = Object.values(hints);
    if (existingHints.includes(hint.trim())) {
      Alert.alert('エラー', 'そのヒントは既に使用されています。');
      return;
    }

    const newHints = { ...hints, [playerId]: hint.trim() };
    setHints(newHints);

    if (Object.keys(newHints).length === players.length) {
      setPhase('order');
    }
  };

  const handleOrderSubmit = () => {
    if (order.length !== players.length) {
      Alert.alert('エラー', '全てのプレイヤーを並べてください。');
      return;
    }
    setPhase('result');
  };

  const handleRestart = () => {
    setPhase('setup');
    setTheme('');
    setCustomTheme('');
    setNumbers({});
    setHints({});
    setOrder([]);
    setCurrentPlayerIndex(0);
  };

  const handleHome = () => {
    navigation.navigate('Home');
  };

  const movePlayerInOrder = (playerId: string, direction: 'up' | 'down') => {
    const currentIndex = order.indexOf(playerId);
    if (currentIndex === -1) return;

    const newOrder = [...order];
    if (direction === 'up' && currentIndex > 0) {
      [newOrder[currentIndex], newOrder[currentIndex - 1]] = [newOrder[currentIndex - 1], newOrder[currentIndex]];
    } else if (direction === 'down' && currentIndex < newOrder.length - 1) {
      [newOrder[currentIndex], newOrder[currentIndex + 1]] = [newOrder[currentIndex + 1], newOrder[currentIndex]];
    }
    setOrder(newOrder);
  };

  const addPlayerToOrder = (playerId: string) => {
    if (!order.includes(playerId)) {
      setOrder([...order, playerId]);
    }
  };

  const removePlayerFromOrder = (playerId: string) => {
    setOrder(order.filter(id => id !== playerId));
  };

  if (phase === 'setup') {
    return (
      <SafeAreaView style={styles.container}>
        <SafetyWarning
          visible={showWarning}
          onAccept={handleWarningAccept}
          title="Ito - 安全運転のお願い"
          message="運転手の方は操作をしないでください。&#10;同乗者の方が操作してください。"
        />

        <ScrollView style={styles.content}>
          <Text style={styles.title}>Ito（簡易版）</Text>
          <Text style={styles.subtitle}>協力して数字を並べよう</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>テーマを選択</Text>
            <View style={styles.themeGrid}>
              {PRESET_THEMES.map((presetTheme) => (
                <SafeButton
                  key={presetTheme}
                  title={presetTheme}
                  onPress={() => handleThemeSelect(presetTheme)}
                  variant={theme === presetTheme ? "primary" : "secondary"}
                  size="medium"
                  style={styles.themeButton}
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>カスタムテーマ</Text>
            <TextInput
              style={styles.input}
              value={customTheme}
              onChangeText={setCustomTheme}
              placeholder="例: 好きな食べ物"
              placeholderTextColor="#64748B"
              maxLength={20}
            />
            <SafeButton
              title="このテーマを使用"
              onPress={handleCustomTheme}
              disabled={!customTheme.trim()}
              variant="secondary"
              size="medium"
            />
          </View>

          {theme && (
            <View style={styles.selectedTheme}>
              <Text style={styles.selectedThemeText}>選択中: {theme}</Text>
            </View>
          )}

          <SafeButton
            title="ゲーム開始"
            onPress={handleStartGame}
            disabled={!theme}
            variant="primary"
            size="large"
            style={styles.startButton}
          />

          <SafeButton
            title="ホームに戻る"
            onPress={handleHome}
            variant="danger"
            size="medium"
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (phase === 'numbers') {
    const currentPlayer = players[currentPlayerIndex];
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>あなたの数字</Text>
          <Text style={styles.subtitle}>テーマ: {theme}</Text>

          <View style={styles.playerCard}>
            <Text style={styles.playerName}>{currentPlayer.name}</Text>
            <Text style={styles.numberText}>{numbers[currentPlayer.id]}</Text>
            <Text style={styles.instruction}>
              この数字を覚えて、他の人に見せないでください
            </Text>
          </View>

          <SafeButton
            title={currentPlayerIndex < players.length - 1 ? "次の人へ" : "ヒント入力へ"}
            onPress={handleNextPlayer}
            variant="primary"
            size="large"
          />
        </View>
      </SafeAreaView>
    );
  }

  if (phase === 'hints') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.content}>
          <Text style={styles.title}>ヒント入力</Text>
          <Text style={styles.subtitle}>テーマ: {theme}</Text>
          <Text style={styles.instruction}>
            自分の数字を表現する1語のヒントを入力してください
          </Text>

          {players.map((player) => (
            <View key={player.id} style={styles.hintCard}>
              <Text style={styles.playerName}>{player.name}</Text>
              {hints[player.id] ? (
                <Text style={styles.submittedHint}>✓ {hints[player.id]}</Text>
              ) : (
                <View style={styles.hintInput}>
                  <TextInput
                    style={styles.input}
                    placeholder="1語でヒントを入力"
                    placeholderTextColor="#64748B"
                    maxLength={10}
                    onSubmitEditing={(e) => handleHintSubmit(player.id, e.nativeEvent.text)}
                  />
                  <SafeButton
                    title="決定"
                    onPress={() => {
                      const input = (document.activeElement as HTMLInputElement)?.value || '';
                      handleHintSubmit(player.id, input);
                    }}
                    variant="primary"
                    size="small"
                  />
                </View>
              )}
            </View>
          ))}

          {Object.keys(hints).length === players.length && (
            <SafeButton
              title="並べ替えへ"
              onPress={() => setPhase('order')}
              variant="success"
              size="large"
              style={styles.nextButton}
            />
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (phase === 'order') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.content}>
          <Text style={styles.title}>並べ替え</Text>
          <Text style={styles.subtitle}>小さい順に並べてください</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ヒント一覧</Text>
            {players.map((player) => (
              <View key={player.id} style={styles.hintDisplay}>
                <Text style={styles.playerName}>{player.name}</Text>
                <Text style={styles.hintText}>{hints[player.id]}</Text>
                <SafeButton
                  title={order.includes(player.id) ? "順序から削除" : "順序に追加"}
                  onPress={() => order.includes(player.id) ? removePlayerFromOrder(player.id) : addPlayerToOrder(player.id)}
                  variant={order.includes(player.id) ? "danger" : "secondary"}
                  size="small"
                />
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>現在の順序（小→大）</Text>
            {order.map((playerId, index) => {
              const player = players.find(p => p.id === playerId);
              return (
                <View key={playerId} style={styles.orderItem}>
                  <Text style={styles.orderNumber}>{index + 1}.</Text>
                  <Text style={styles.playerName}>{player?.name}</Text>
                  <Text style={styles.hintText}>{hints[playerId]}</Text>
                  <View style={styles.orderControls}>
                    <SafeButton
                      title="↑"
                      onPress={() => movePlayerInOrder(playerId, 'up')}
                      disabled={index === 0}
                      variant="secondary"
                      size="small"
                    />
                    <SafeButton
                      title="↓"
                      onPress={() => movePlayerInOrder(playerId, 'down')}
                      disabled={index === order.length - 1}
                      variant="secondary"
                      size="small"
                    />
                  </View>
                </View>
              );
            })}
          </View>

          <SafeButton
            title="答え合わせ"
            onPress={handleOrderSubmit}
            disabled={order.length !== players.length}
            variant="success"
            size="large"
            style={styles.nextButton}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (phase === 'result') {
    const correctOrder = players
      .map(player => ({ ...player, number: numbers[player.id] }))
      .sort((a, b) => a.number - b.number);

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.content}>
          <Text style={styles.title}>結果発表</Text>
          <Text style={styles.subtitle}>テーマ: {theme}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>あなたたちの順序</Text>
            {order.map((playerId, index) => {
              const player = players.find(p => p.id === playerId);
              return (
                <View key={playerId} style={styles.resultItem}>
                  <Text style={styles.orderNumber}>{index + 1}.</Text>
                  <Text style={styles.playerName}>{player?.name}</Text>
                  <Text style={styles.hintText}>{hints[playerId]}</Text>
                  <Text style={styles.numberResult}>{numbers[playerId]}</Text>
                </View>
              );
            })}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>正解の順序</Text>
            {correctOrder.map((player, index) => (
              <View key={player.id} style={styles.resultItem}>
                <Text style={styles.orderNumber}>{index + 1}.</Text>
                <Text style={styles.playerName}>{player.name}</Text>
                <Text style={styles.hintText}>{hints[player.id]}</Text>
                <Text style={styles.numberResult}>{player.number}</Text>
              </View>
            ))}
          </View>

          <SafeButton
            title="もう一回"
            onPress={handleRestart}
            variant="primary"
            size="large"
            style={styles.nextButton}
          />

          <SafeButton
            title="ホームに戻る"
            onPress={handleHome}
            variant="danger"
            size="medium"
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return null;
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 16,
  },
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  themeButton: {
    flex: 1,
    minWidth: 80,
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
  selectedTheme: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  selectedThemeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#61D4D4',
  },
  startButton: {
    marginBottom: 16,
  },
  playerCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    marginBottom: 32,
  },
  playerName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 16,
  },
  numberText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#61D4D4',
    marginBottom: 16,
  },
  instruction: {
    fontSize: 16,
    color: '#CBD5E1',
    textAlign: 'center',
    lineHeight: 24,
  },
  hintCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  hintInput: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  submittedHint: {
    fontSize: 18,
    color: '#22C55E',
    fontWeight: '600',
  },
  hintDisplay: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hintText: {
    fontSize: 16,
    color: '#CBD5E1',
    flex: 1,
    marginLeft: 12,
  },
  orderItem: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F8FAFC',
    width: 30,
  },
  orderControls: {
    flexDirection: 'row',
    gap: 8,
  },
  resultItem: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  numberResult: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#61D4D4',
    marginLeft: 'auto',
  },
  nextButton: {
    marginBottom: 16,
  },
});
