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

import RetroItem from '../components/retro-item/RetroItem';
import ColumnType from '../types/ColumnType';

export default {
  title: 'components/RetroItem',
  component: RetroItem,
} as ComponentMeta<typeof RetroItem>;

const testThought = {
  id: 0,
  discussed: false,
  hearts: 0,
  message:
    "If elevators hadn't been invented, all the CEOs and important people would have their offices on the first floor as a sign of status.",
};

const Template: ComponentStory<typeof RetroItem> = () => {
  const [thought, setThought] = React.useState(testThought);

  function onEdit(message) {
    setThought((oldThought) => ({ ...oldThought, message }));
  }

  function onUpvote() {
    setThought(({ hearts, ...rest }) => ({ ...rest, hearts: hearts + 1 }));
  }

  function onDiscussed() {
    setThought(({ discussed, ...rest }) => ({ ...rest, discussed: !discussed }));
  }

  function onDelete() {
    alert('thought deleted');
  }

  function onSelect() {
    alert('thought selected');
  }

  return (
    <>
      <div style={{ width: '400px', marginBottom: '20px' }}>
        <RetroItem
          thought={thought}
          type={ColumnType.HAPPY}
          onUpvote={onUpvote}
          onEdit={onEdit}
          onDelete={onDelete}
          onDiscuss={onDiscussed}
          onSelect={onSelect}
        />
      </div>
      <div style={{ width: '400px' }}>
        <RetroItem
          readOnly={true}
          thought={{ ...testThought, discussed: true }}
          type={ColumnType.UNHAPPY}
          onUpvote={onUpvote}
          onEdit={onEdit}
          onDelete={onDelete}
          onDiscuss={onDiscussed}
          onSelect={onSelect}
        />
      </div>
    </>
  );
};

export const Example = Template.bind({});
