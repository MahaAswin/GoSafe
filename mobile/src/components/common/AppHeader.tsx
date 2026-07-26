import React from 'react';
import { Appbar } from 'react-native-paper';
import { router } from 'expo-router';

interface AppHeaderProps {
  title: string;
  showBackButton?: boolean;
  actions?: Array<{
    icon: string;
    onPress: () => void;
  }>;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  showBackButton = false,
  actions = [],
}) => {
  return (
    <Appbar.Header>
      {showBackButton && <Appbar.BackAction onPress={() => router.back()} />}
      <Appbar.Content title={title} titleStyle={{ fontWeight: 'bold' }} />
      {actions.map((action, index) => (
        <Appbar.Action key={index} icon={action.icon} onPress={action.onPress} />
      ))}
    </Appbar.Header>
  );
};
