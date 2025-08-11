import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SafeButton } from '../SafeButton';

describe('SafeButton', () => {
  test('should render with title', () => {
    const { getByText } = render(
      <SafeButton title="Test Button" onPress={() => {}} />
    );
    
    expect(getByText('Test Button')).toBeTruthy();
  });

  test('should call onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <SafeButton title="Test Button" onPress={mockOnPress} />
    );
    
    fireEvent.press(getByText('Test Button'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  test('should be disabled when disabled prop is true', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <SafeButton title="Test Button" onPress={mockOnPress} disabled={true} />
    );
    
    const button = getByText('Test Button');
    fireEvent.press(button);
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  test('should apply different variants correctly', () => {
    const { getByText: getPrimary } = render(
      <SafeButton title="Primary" onPress={() => {}} variant="primary" />
    );
    const { getByText: getSecondary } = render(
      <SafeButton title="Secondary" onPress={() => {}} variant="secondary" />
    );
    
    expect(getPrimary('Primary')).toBeTruthy();
    expect(getSecondary('Secondary')).toBeTruthy();
  });

  test('should apply different sizes correctly', () => {
    const { getByText: getLarge } = render(
      <SafeButton title="Large" onPress={() => {}} size="large" />
    );
    const { getByText: getMedium } = render(
      <SafeButton title="Medium" onPress={() => {}} size="medium" />
    );
    
    expect(getLarge('Large')).toBeTruthy();
    expect(getMedium('Medium')).toBeTruthy();
  });
});
