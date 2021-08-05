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

import { PrimaryButton } from '../components/button/Button';
import Modal, { ModalMethods } from '../components/modal/Modal';

export default {
  title: 'components/Modal',
  component: Modal,
} as ComponentMeta<typeof Modal>;

const Template: ComponentStory<typeof Modal> = () => {
  const ref = React.createRef<ModalMethods>();

  return (
    <>
      <div style={{ display: 'flex' }}>
        <PrimaryButton onClick={() => ref.current.show()}>Show Modal</PrimaryButton>
      </div>

      <Modal ref={ref}>
        <div style={{ color: 'white' }}>This is some modal content</div>
      </Modal>
    </>
  );
};

export const Example = Template.bind({});
