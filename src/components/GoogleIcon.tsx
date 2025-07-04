import * as React from 'react';
import { View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface GoogleIconProps {
  size?: number;
  color?: string;
}

export const GoogleIcon: React.FC<GoogleIconProps> = ({ 
  size = 24, 
  color = '#4285F4' 
}) => {
  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <MaterialIcons name="login" size={size} color={color} />
    </View>
  );
};
