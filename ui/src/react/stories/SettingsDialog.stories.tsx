/*
 * Copyright (c) 2021 Ford Motor Company
 * All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { DialogMethods } from '../components/dialog/Dialog';
import { SettingsDialogRenderer } from '../components/settings-dialog/SettingsDialog';
import { PrimaryButton } from '../components/button/Button';
import Theme from '../types/theme';

export default {
  title: 'components/SettingsDialog',
  component: SettingsDialogRenderer,
} as ComponentMeta<typeof SettingsDialogRenderer>;

const Template: ComponentStory<typeof SettingsDialogRenderer> = () => {
  const ref = React.createRef<DialogMethods>();
  const [theme, setTheme] = React.useState<Theme>(Theme.LIGHT);

  return (
    <>
      <PrimaryButton onClick={() => ref.current.show()}>Change Settings</PrimaryButton>
      <SettingsDialogRenderer
        theme={theme}
        onThemeChange={(theme) => {
          setTheme(theme);
          alert(`theme changed to ${theme}`);
        }}
        onLogout={() => alert('logout')}
        ref={ref}
      />
    </>
  );
};

export const Example = Template.bind({});
