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

import * as React from 'react';
import { Fragment } from 'react';
import { useRecoilValue } from 'recoil';

import ActionItem from '../../../components/action-item/ActionItem';
import ColumnHeader from '../../../components/column-header/ColumnHeader';
import { CountSeparator } from '../../../components/count-separator/CountSeparator';
import TextField from '../../../components/text-field/TextField';
import { ActiveActionItemsState, CompletedActionItemsState } from '../../../state/ActionItemState';
import { ColumnTitleByTopicState } from '../../../state/ColumnTitleState';
import Action from '../../../types/Action';
import Topic from '../../../types/Topic';

function ActionItemsColumn() {
  const topic = Topic.ACTION;
  // const team = useRecoilValue(TeamState);
  const columnTitle = useRecoilValue(ColumnTitleByTopicState(topic));
  const { title } = columnTitle;

  const activeActionItems = useRecoilValue<Action[]>(ActiveActionItemsState);
  const completedActionItems = useRecoilValue<Action[]>(CompletedActionItemsState);

  const createActionItem = (text: string) => {
    console.log('Create Action', text);
  };

  const deleteActionItem = (action: Action) => {
    console.log('Delete Action', action);
  };

  const renderActionItem = (action: Action) => {
    return (
      <Fragment key={action.id}>
        <ActionItem onDelete={deleteActionItem} action={action} />
      </Fragment>
    );
  };

  return (
    <div className="retro-column" data-testid={`retroColumn__${topic}`}>
      <ColumnHeader initialTitle={title} type={topic} sortedChanged={() => undefined} titleChanged={() => undefined} />
      <TextField type={topic} placeholder="Enter an Action Item" handleSubmission={createActionItem} />
      <CountSeparator count={activeActionItems.length} />
      {activeActionItems.map(renderActionItem)}
      {completedActionItems.map(renderActionItem)}
    </div>
  );
}

export default ActionItemsColumn;
