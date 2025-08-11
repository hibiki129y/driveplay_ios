import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { RecommendationScreen } from '../screens/RecommendationScreen';
import { TalkDiceScreen } from '../screens/games/TalkDiceScreen';
import { ItoScreen } from '../screens/games/ItoScreen';
import { InsiderScreen } from '../screens/games/InsiderScreen';
import { RoomScreen } from '../screens/RoomScreen';

export type RootStackParamList = {
  Onboarding: undefined;
  Home: undefined;
  Recommendation: undefined;
  TalkDice: undefined;
  Ito: undefined;
  Insider: undefined;
  Room: { code?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Onboarding"
        screenOptions={{
          headerShown: false,
          orientation: 'portrait',
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Recommendation" component={RecommendationScreen} />
        <Stack.Screen name="TalkDice" component={TalkDiceScreen} />
        <Stack.Screen name="Ito" component={ItoScreen} />
        <Stack.Screen name="Insider" component={InsiderScreen} />
        <Stack.Screen name="Room" component={RoomScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
