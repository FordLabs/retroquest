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

import React, { useRef, useState } from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { PrimaryButton } from '../components/button/Button';
import { ModalMethods } from '../components/modal/Modal';
import { ThoughtTopic } from '../components/retro-item/RetroItem';
import RetroItemModal from '../components/retro-item-modal/RetroItemModal';
import ColumnTopic from '../types/ColumnTopic';

export default {
  title: 'components/RetroItemModal',
  component: RetroItemModal,
} as ComponentMeta<typeof RetroItemModal>;

const testThought = {
  id: 0,
  discussed: false,
  hearts: 0,
  message:
    "If elevators hadn't been invented, all the CEOs and" +
    'important people would have their offices on the first floor as a sign of status.',
};

const Template: ComponentStory<typeof RetroItemModal> = () => {
  const [thought, setThought] = useState(testThought);
  const [type, setType] = useState<ThoughtTopic>(ColumnTopic.HAPPY);

  const modalRef = useRef<ModalMethods>();
  const readOnlyModalRef = useRef<ModalMethods>();

  function onUpvote() {
    setThought(({ hearts, ...rest }) => ({ ...rest, hearts: hearts + 1 }));
  }

  function onEdit(task) {
    setThought((oldAction) => ({ ...oldAction, task }));
  }

  function onDiscuss() {
    setThought(({ discussed, ...rest }) => ({ ...rest, discussed: !discussed }));
  }

  function onDelete() {
    alert('action deleted');
  }

  return (
    <>
      <PrimaryButton onClick={() => modalRef.current?.show()} style={{ marginBottom: '20px' }}>
        Show Modal
      </PrimaryButton>
      <RetroItemModal
        type={ColumnTopic.HAPPY}
        thought={thought}
        onAction={(task, assignee) => alert(`${task} @${assignee}`)}
        onUpvote={onUpvote}
        onEdit={onEdit}
        onDelete={onDelete}
        onDiscuss={onDiscuss}
        ref={modalRef}
      />

      <PrimaryButton
        onClick={() => {
          setType((currentType) => {
            switch (currentType) {
              case ColumnTopic.HAPPY:
                return ColumnTopic.CONFUSED;
              case ColumnTopic.CONFUSED:
                return ColumnTopic.UNHAPPY;
              default:
                return ColumnTopic.HAPPY;
            }
          });
          readOnlyModalRef.current?.show();
        }}
      >
        Show Readonly Modal
      </PrimaryButton>
      <RetroItemModal
        readOnly={true}
        type={type}
        thought={thought}
        onEdit={onEdit}
        onDelete={onDelete}
        onDiscuss={onDiscuss}
        ref={readOnlyModalRef}
      />
    </>
  );
};

export const Example = Template.bind({});
