import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SafetyWarning } from '../SafetyWarning';

describe('SafetyWarning', () => {
  test('should render safety warning message when visible', () => {
    const mockOnAccept = jest.fn();
    const { getByText } = render(
      <SafetyWarning visible={true} onAccept={mockOnAccept} />
    );
    
    expect(getByText('安全運転のお願い')).toBeTruthy();
    expect(getByText('運転手の方は操作をしないでください。\n同乗者の方が操作してください。')).toBeTruthy();
  });

  test('should render with custom message when provided', () => {
    const customMessage = 'Custom safety message';
    const mockOnAccept = jest.fn();
    const { getByText } = render(
      <SafetyWarning 
        visible={true} 
        onAccept={mockOnAccept} 
        message={customMessage} 
      />
    );
    
    expect(getByText('安全運転のお願い')).toBeTruthy();
    expect(getByText(customMessage)).toBeTruthy();
  });

  test('should call onAccept when button is pressed', () => {
    const mockOnAccept = jest.fn();
    const { getByText } = render(
      <SafetyWarning visible={true} onAccept={mockOnAccept} />
    );
    
    fireEvent.press(getByText('理解しました'));
    expect(mockOnAccept).toHaveBeenCalledTimes(1);
  });

  test('should render with custom title when provided', () => {
    const customTitle = 'Custom Title';
    const mockOnAccept = jest.fn();
    const { getByText } = render(
      <SafetyWarning 
        visible={true} 
        onAccept={mockOnAccept} 
        title={customTitle} 
      />
    );
    
    expect(getByText(customTitle)).toBeTruthy();
  });
});
