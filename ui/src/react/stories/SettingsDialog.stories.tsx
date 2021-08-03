import * as React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { SettingsDialogRenderer } from '../components/settings-dialog/SettingsDialog';

export default {
  title: 'components/SettingsDialog',
  component: SettingsDialogRenderer,
} as ComponentMeta<typeof SettingsDialogRenderer>;

const Template: ComponentStory<typeof SettingsDialogRenderer> = () => {
  const [theme, setTheme] = React.useState<'light-theme' | 'dark-theme'>('light-theme');

  return (
    <SettingsDialogRenderer
      theme={theme}
      onThemeChange={(theme) => {
        setTheme(theme);
        alert(`theme changed to ${theme}`);
      }}
      onLogout={() => alert('logout')}
      onHide={() => alert('hide dialog')}
    />
  );
};

export const Example = Template.bind({});
