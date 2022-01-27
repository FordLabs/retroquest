/*
 * Copyright (c) 2022 Ford Motor Company
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

import { Fragment } from 'react';
import * as React from 'react';

import ActionItem from '../../../components/action-item/ActionItem';
import ColumnHeader from '../../../components/column-header/ColumnHeader';
import { CountSeparator } from '../../../components/count-separator/CountSeparator';
import RetroItem from '../../../components/retro-item/RetroItem';
import TextField from '../../../components/text-field/TextField';
import Action from '../../../types/Action';
import { Column } from '../../../types/Column';
import ColumnTopic from '../../../types/ColumnTopic';
import Thought from '../../../types/Thought';

import './RetroColumn.scss';

type Props = {
  column: Column;
};

function RetroColumn(props: Props) {
  const { topic, title, items } = props.column;
  const { active: activeItems, completed: completeItems } = items;

  const isActionItemsColumn = topic === ColumnTopic.ACTION;

  const renderItems = (item: Action) => {
    return (
      <Fragment key={item.id}>
        {isActionItemsColumn ? (
          <ActionItem action={item as Action} />
        ) : (
          <RetroItem thought={item as unknown as Thought} type={topic} />
        )}
      </Fragment>
    );
  };

  return (
    <div className="retro-column">
      <ColumnHeader
        initialTitle={title}
        type={topic}
        readOnly={isActionItemsColumn}
        sortedChanged={() => undefined}
        titleChanged={() => undefined}
      />
      <TextField type={topic} placeholder="Enter a Thought" handleSubmission={() => undefined} />
      <CountSeparator count={items.active.length} />
      {activeItems.map(renderItems)}
      {completeItems.map(renderItems)}
    </div>
  );
}

export default RetroColumn;
