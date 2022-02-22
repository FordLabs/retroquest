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
import { useRef, useState } from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import ActionItemModal from '../components/action-item-modal/ActionItemModal';
import { PrimaryButton } from '../components/button/Button';
import { ModalMethods } from '../components/modal/Modal';

export default {
  title: 'components/ActionItemModal',
  component: ActionItemModal,
} as ComponentMeta<typeof ActionItemModal>;

const testAction = {
  id: 0,
  task: 'Finish this react migration',
  assignee: 'FordLabs',
  completed: false,
  dateCreated: '2021-08-12',
};

const Template: ComponentStory<typeof ActionItemModal> = () => {
  const [action, setAction] = useState(testAction);

  const modalRef = useRef<ModalMethods>();
  const readOnlyModalRef = useRef<ModalMethods>();

  function onComplete() {
    setAction(({ completed, ...rest }) => ({ ...rest, completed: !completed }));
  }

  return (
    <>
      <PrimaryButton onClick={() => modalRef.current?.show()} style={{ marginBottom: '20px' }}>
        Show Modal
      </PrimaryButton>
      <ActionItemModal action={action} onComplete={onComplete} ref={modalRef} />
      <PrimaryButton onClick={() => readOnlyModalRef.current?.show()}>Show Readonly Modal</PrimaryButton>
      <ActionItemModal readOnly={true} action={action} onComplete={onComplete} ref={readOnlyModalRef} />
    </>
  );
};

export const Example = Template.bind({});
