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
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { EndRetroDialogRenderer } from '../components/end-retro-dialog/EndRetroDialog';

export default {
  title: 'components/EndRetroDialog',
  component: EndRetroDialogRenderer,
} as ComponentMeta<typeof EndRetroDialogRenderer>;

const Template: ComponentStory<typeof EndRetroDialogRenderer> = () => {
  return <EndRetroDialogRenderer onSubmit={() => alert('ending retro')} onHide={() => alert('hide dialog')} />;
};

export const Example = Template.bind({});
