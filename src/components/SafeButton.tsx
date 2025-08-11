import React from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native';

interface SafeButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const SafeButton: React.FC<SafeButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
  textStyle,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 48, // Minimum touch target
      minWidth: 48,
    };
    
    const sizeStyles: Record<string, ViewStyle> = {
      small: { paddingHorizontal: 16, paddingVertical: 12, minHeight: 48 },
      medium: { paddingHorizontal: 24, paddingVertical: 16, minHeight: 56 },
      large: { paddingHorizontal: 32, paddingVertical: 20, minHeight: 64 },
    };
    
    const colorStyles: Record<string, ViewStyle> = {
      primary: { backgroundColor: disabled ? '#475569' : '#61D4D4' },
      secondary: { backgroundColor: disabled ? '#475569' : '#FFB3C1' },
      danger: { backgroundColor: disabled ? '#475569' : '#EF4444' },
      success: { backgroundColor: disabled ? '#475569' : '#22C55E' },
    };
    
    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...colorStyles[variant],
      opacity: disabled ? 0.6 : 1,
      ...style,
    };
  };
  
  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      fontWeight: '600',
      textAlign: 'center',
      color: '#FFFFFF',
    };
    
    const sizeTextStyles: Record<string, TextStyle> = {
      small: { fontSize: 16 },
      medium: { fontSize: 18 },
      large: { fontSize: 20 },
    };
    
    return {
      ...baseTextStyle,
      ...sizeTextStyles[size],
      ...textStyle,
    };
  };
  
  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={getTextStyle()}>{title}</Text>
    </TouchableOpacity>
  );
};
