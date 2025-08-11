import React from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import { SafeButton } from './SafeButton';

interface SafetyWarningProps {
  visible: boolean;
  onAccept: () => void;
  title?: string;
  message?: string;
}

export const SafetyWarning: React.FC<SafetyWarningProps> = ({
  visible,
  onAccept,
  title = '安全運転のお願い',
  message = '運転手の方は操作をしないでください。\n同乗者の方が操作してください。',
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <SafeButton
            title="理解しました"
            onPress={onAccept}
            variant="primary"
            size="large"
            style={styles.button}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F8FAFC',
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    fontSize: 18,
    color: '#CBD5E1',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 32,
  },
  button: {
    width: '100%',
  },
});
