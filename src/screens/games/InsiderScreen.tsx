import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeButton } from '../../components/SafeButton';
import { SafetyWarning } from '../../components/SafetyWarning';
import { useGameStore } from '../../store/gameStore';
import { InsiderState, Role } from '../../types';
import { RootStackParamList } from '../../navigation/AppNavigator';

import insiderWords from '../../../assets/data/insider_words.json';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Insider'>;

export const InsiderScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { players, insiderState, setInsiderState } = useGameStore();
  
  const [showWarning, setShowWarning] = useState(true);
  const [gameState, setGameState] = useState<InsiderState>({
    phase: 'assign',
    players: players.map(p => ({ ...p })),
    candidates: [],
    questionSeconds: 180,
    discussSeconds: 0,
  });
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [selectedVotes, setSelectedVotes] = useState<Record<string, string>>({});

  useEffect(() => {
    if (insiderState) {
      setGameState(insiderState);
    } else {
      initializeGame();
    }
  }, []);

  useEffect(() => {
    setInsiderState(gameState);
  }, [gameState]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const initializeGame = () => {
    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    const master = shuffledPlayers[0];
    const insider = shuffledPlayers[1];
    const citizens = shuffledPlayers.slice(2);

    const playersWithRoles = shuffledPlayers.map(player => ({
      ...player,
      role: player.id === master.id ? 'MASTER' as Role : 
            player.id === insider.id ? 'INSIDER' as Role : 
            'CITIZEN' as Role,
    }));

    const selectedWords = insiderWords
      .sort(() => Math.random() - 0.5)
      .slice(0, 6);

    const answerIndex = Math.floor(Math.random() * 6) + 1;

    setGameState({
      phase: 'assign',
      players: playersWithRoles,
      candidates: selectedWords,
      answerIndex,
      questionSeconds: 180,
      discussSeconds: 0,
    });
  };

  const handleWarningAccept = () => {
    setShowWarning(false);
  };

  const handleTimeUp = () => {
    if (gameState.phase === 'question') {
      const remainingTime = timeLeft;
      setGameState(prev => ({
        ...prev,
        phase: 'discuss',
        discussSeconds: remainingTime,
      }));
      setTimeLeft(remainingTime);
      setIsTimerRunning(true);
    } else if (gameState.phase === 'discuss') {
      setGameState(prev => ({ ...prev, phase: 'accuse' }));
    }
  };

  const handleStartQuestion = () => {
    setGameState(prev => ({ ...prev, phase: 'question' }));
    setTimeLeft(gameState.questionSeconds);
    setIsTimerRunning(true);
  };

  const handleCorrectAnswer = () => {
    const remainingTime = timeLeft;
    setIsTimerRunning(false);
    setGameState(prev => ({
      ...prev,
      phase: 'discuss',
      discussSeconds: remainingTime,
    }));
    setTimeLeft(remainingTime);
    setIsTimerRunning(true);
  };

  const handleMasterResponse = (response: 'yes' | 'no' | 'unknown') => {
    Alert.alert('回答記録', `マスターの回答: ${response === 'yes' ? 'はい' : response === 'no' ? 'いいえ' : 'わからない'}`);
  };

  const handleVote = (voterId: string, targetId: string) => {
    setSelectedVotes(prev => ({ ...prev, [voterId]: targetId }));
  };

  const handleSubmitVotes = () => {
    if (Object.keys(selectedVotes).length !== players.length) {
      Alert.alert('エラー', '全員が投票してください。');
      return;
    }

    const voteCounts: Record<string, number> = {};
    Object.values(selectedVotes).forEach(targetId => {
      voteCounts[targetId] = (voteCounts[targetId] || 0) + 1;
    });

    const maxVotes = Math.max(...Object.values(voteCounts));
    const mostVoted = Object.keys(voteCounts).find(id => voteCounts[id] === maxVotes);

    if (!mostVoted) {
      Alert.alert('エラー', '投票結果を処理できませんでした。');
      return;
    }

    const accusedPlayer = gameState.players.find(p => p.id === mostVoted);
    const insider = gameState.players.find(p => p.role === 'INSIDER');
    
    let winner: 'citizens' | 'insider';
    if (accusedPlayer?.role === 'INSIDER') {
      winner = 'citizens';
    } else {
      winner = 'insider';
    }

    setGameState(prev => ({
      ...prev,
      phase: 'result',
      votes: selectedVotes,
      result: { winner, accusedId: mostVoted },
    }));
  };

  const handleRestart = () => {
    setCurrentPlayerIndex(0);
    setTimeLeft(0);
    setIsTimerRunning(false);
    setSelectedVotes({});
    initializeGame();
  };

  const handleHome = () => {
    navigation.navigate('Home');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (gameState.phase === 'assign') {
    const currentPlayer = gameState.players[currentPlayerIndex];
    const isLastPlayer = currentPlayerIndex === gameState.players.length - 1;

    return (
      <SafeAreaView style={styles.container}>
        <SafetyWarning
          visible={showWarning}
          onAccept={handleWarningAccept}
          title="Insider - 安全運転のお願い"
          message="運転手の方は操作をしないでください。&#10;同乗者の方が操作してください。"
        />

        <View style={styles.content}>
          <Text style={styles.title}>Insider（内通者）</Text>
          <Text style={styles.subtitle}>役職確認</Text>

          <View style={styles.roleCard}>
            <Text style={styles.playerName}>{currentPlayer.name}</Text>
            <Text style={styles.roleText}>あなたの役職</Text>
            <Text style={styles.roleName}>
              {currentPlayer.role === 'MASTER' ? 'マスター' :
               currentPlayer.role === 'INSIDER' ? 'インサイダー' : '庶民'}
            </Text>
            
            {currentPlayer.role === 'MASTER' && (
              <View style={styles.wordSection}>
                <Text style={styles.wordTitle}>答えの単語</Text>
                <Text style={styles.answerWord}>
                  {gameState.candidates[gameState.answerIndex! - 1]}
                </Text>
                <Text style={styles.candidatesTitle}>候補単語（1-6）</Text>
                {gameState.candidates.map((word, index) => (
                  <Text key={index} style={styles.candidateWord}>
                    {index + 1}. {word}
                  </Text>
                ))}
              </View>
            )}

            {currentPlayer.role === 'INSIDER' && (
              <View style={styles.wordSection}>
                <Text style={styles.wordTitle}>答えの単語</Text>
                <Text style={styles.answerWord}>
                  {gameState.candidates[gameState.answerIndex! - 1]}
                </Text>
              </View>
            )}

            <Text style={styles.instruction}>
              周囲に見えないように画面を伏せてください
            </Text>
          </View>

          <SafeButton
            title={isLastPlayer ? "ゲーム開始" : "次の人へ"}
            onPress={() => {
              if (isLastPlayer) {
                handleStartQuestion();
              } else {
                setCurrentPlayerIndex(currentPlayerIndex + 1);
              }
            }}
            variant="primary"
            size="large"
          />
        </View>
      </SafeAreaView>
    );
  }

  if (gameState.phase === 'question') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>質問フェーズ</Text>
          <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
          
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(timeLeft / gameState.questionSeconds) * 100}%` }
              ]} 
            />
          </View>

          <View style={styles.candidatesSection}>
            <Text style={styles.candidatesTitle}>候補単語（1-6）</Text>
            {gameState.candidates.map((word, index) => (
              <Text key={index} style={styles.candidateWord}>
                {index + 1}. {word}
              </Text>
            ))}
          </View>

          <Text style={styles.instruction}>
            庶民とインサイダーは質問をしてください。&#10;
            マスターは「はい」「いいえ」「わからない」で答えてください。
          </Text>

          <View style={styles.masterControls}>
            <Text style={styles.masterTitle}>マスターの回答</Text>
            <View style={styles.responseButtons}>
              <SafeButton
                title="はい"
                onPress={() => handleMasterResponse('yes')}
                variant="success"
                size="large"
                style={styles.responseButton}
              />
              <SafeButton
                title="いいえ"
                onPress={() => handleMasterResponse('no')}
                variant="danger"
                size="large"
                style={styles.responseButton}
              />
              <SafeButton
                title="わからない"
                onPress={() => handleMasterResponse('unknown')}
                variant="secondary"
                size="large"
                style={styles.responseButton}
              />
            </View>
          </View>

          <SafeButton
            title="正解が出た！"
            onPress={handleCorrectAnswer}
            variant="primary"
            size="large"
            style={styles.correctButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (gameState.phase === 'discuss') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>推理フェーズ</Text>
          <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
          
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(timeLeft / gameState.discussSeconds) * 100}%` }
              ]} 
            />
          </View>

          <Text style={styles.instruction}>
            誰がインサイダーか話し合ってください。&#10;
            時間が終わったら投票に移ります。
          </Text>

          <View style={styles.playersSection}>
            <Text style={styles.sectionTitle}>プレイヤー一覧</Text>
            {gameState.players.map((player) => (
              <View key={player.id} style={styles.playerItem}>
                <Text style={styles.playerName}>{player.name}</Text>
                <Text style={styles.roleHint}>
                  {player.role === 'MASTER' ? 'マスター' : '？？？'}
                </Text>
              </View>
            ))}
          </View>

          <SafeButton
            title="投票に進む"
            onPress={() => {
              setIsTimerRunning(false);
              setGameState(prev => ({ ...prev, phase: 'accuse' }));
            }}
            variant="primary"
            size="large"
          />
        </View>
      </SafeAreaView>
    );
  }

  if (gameState.phase === 'accuse') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.content}>
          <Text style={styles.title}>告発フェーズ</Text>
          <Text style={styles.subtitle}>インサイダーだと思う人に投票</Text>

          {gameState.players.map((voter) => (
            <View key={voter.id} style={styles.voteSection}>
              <Text style={styles.voterName}>{voter.name}の投票</Text>
              <View style={styles.voteOptions}>
                {gameState.players
                  .filter(p => p.id !== voter.id && p.role !== 'MASTER')
                  .map((candidate) => (
                    <SafeButton
                      key={candidate.id}
                      title={candidate.name}
                      onPress={() => handleVote(voter.id, candidate.id)}
                      variant={selectedVotes[voter.id] === candidate.id ? "primary" : "secondary"}
                      size="medium"
                      style={styles.voteButton}
                    />
                  ))}
              </View>
            </View>
          ))}

          <SafeButton
            title="投票結果を見る"
            onPress={handleSubmitVotes}
            disabled={Object.keys(selectedVotes).length !== players.length}
            variant="success"
            size="large"
            style={styles.submitButton}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (gameState.phase === 'result') {
    const insider = gameState.players.find(p => p.role === 'INSIDER');
    const accusedPlayer = gameState.players.find(p => p.id === gameState.result?.accusedId);
    
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.content}>
          <Text style={styles.title}>ゲーム結果</Text>
          
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>
              {gameState.result?.winner === 'citizens' ? '庶民の勝利！' : 'インサイダーの勝利！'}
            </Text>
            <Text style={styles.resultText}>
              告発された人: {accusedPlayer?.name}
            </Text>
            <Text style={styles.resultText}>
              インサイダーは: {insider?.name}
            </Text>
            <Text style={styles.answerReveal}>
              答えの単語: {gameState.candidates[gameState.answerIndex! - 1]}
            </Text>
          </View>

          <View style={styles.rolesReveal}>
            <Text style={styles.sectionTitle}>役職発表</Text>
            {gameState.players.map((player) => (
              <View key={player.id} style={styles.roleRevealItem}>
                <Text style={styles.playerName}>{player.name}</Text>
                <Text style={styles.roleText}>
                  {player.role === 'MASTER' ? 'マスター' :
                   player.role === 'INSIDER' ? 'インサイダー' : '庶民'}
                </Text>
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
  roleCard: {
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
  roleText: {
    fontSize: 16,
    color: '#CBD5E1',
    marginBottom: 8,
  },
  roleName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#61D4D4',
    marginBottom: 24,
  },
  wordSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  wordTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 12,
  },
  answerWord: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#22C55E',
    marginBottom: 20,
  },
  candidatesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 12,
  },
  candidateWord: {
    fontSize: 16,
    color: '#CBD5E1',
    marginBottom: 4,
  },
  instruction: {
    fontSize: 16,
    color: '#CBD5E1',
    textAlign: 'center',
    lineHeight: 24,
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#F59E0B',
    textAlign: 'center',
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#1E293B',
    borderRadius: 4,
    marginBottom: 32,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
  },
  candidatesSection: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  masterControls: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  masterTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F8FAFC',
    textAlign: 'center',
    marginBottom: 16,
  },
  responseButtons: {
    gap: 12,
  },
  responseButton: {
    marginBottom: 8,
  },
  correctButton: {
    marginTop: 16,
  },
  playersSection: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 16,
  },
  playerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  roleHint: {
    fontSize: 16,
    color: '#CBD5E1',
  },
  voteSection: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  voterName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 12,
  },
  voteOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  voteButton: {
    flex: 1,
    minWidth: 100,
  },
  submitButton: {
    marginTop: 16,
  },
  resultCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    marginBottom: 32,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#22C55E',
    textAlign: 'center',
    marginBottom: 16,
  },
  resultText: {
    fontSize: 18,
    color: '#F8FAFC',
    textAlign: 'center',
    marginBottom: 8,
  },
  answerReveal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#61D4D4',
    textAlign: 'center',
    marginTop: 16,
  },
  rolesReveal: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  roleRevealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  nextButton: {
    marginBottom: 16,
  },
});
