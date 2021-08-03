import * as React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { SettingsDialogRenderer } from '../components/settings-dialog/SettingsDialog';
import Theme from '../types/theme';

export default {
  title: 'components/SettingsDialog',
  component: SettingsDialogRenderer,
} as ComponentMeta<typeof SettingsDialogRenderer>;

const Template: ComponentStory<typeof SettingsDialogRenderer> = () => {
  const [theme, setTheme] = React.useState<Theme>(Theme.LIGHT);

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
