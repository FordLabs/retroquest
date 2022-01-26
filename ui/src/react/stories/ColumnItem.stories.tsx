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

import ColumnItem from '../components/column-item/ColumnItem';
import ColumnTopic from '../types/ColumnTopic';

export default {
  title: 'components/ColumnItem',
  component: ColumnItem,
} as ComponentMeta<typeof ColumnItem>;

const testText =
  "If elevators hadn't been invented, all the CEOs and" +
  'important people would have their offices on the first floor as a sign of status.';

const Template: ComponentStory<typeof ColumnItem> = () => {
  const [text, setText] = React.useState(testText);
  const [checked, setChecked] = React.useState(false);

  function onEdit(newText) {
    setText(newText);
  }

  function onCheck() {
    setChecked((oldChecked) => !oldChecked);
  }

  function onDelete() {
    alert('deleted');
  }

  function onSelect() {
    alert('selected');
  }

  const props = {
    readOnly: true,
    text: text,
    checked: checked,
    onSelect: onSelect,
    style: { marginBottom: '20px' },
  };

  return (
    <>
      <div style={{ width: '400px', marginBottom: '20px' }}>
        <ColumnItem
          type={ColumnTopic.HAPPY}
          text={text}
          checked={checked}
          onEdit={onEdit}
          onDelete={onDelete}
          onCheck={onCheck}
          onSelect={onSelect}
        />
      </div>
      <div style={{ width: '400px', display: 'flex', flexDirection: 'column' }}>
        <ColumnItem type={ColumnTopic.CONFUSED} {...props} />
        <ColumnItem type={ColumnTopic.UNHAPPY} {...props} />
        <ColumnItem type={ColumnTopic.ACTION} {...props} />
      </div>
    </>
  );
};

export const Example = Template.bind({});
