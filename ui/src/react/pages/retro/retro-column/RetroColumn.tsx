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
import { useRecoilValue } from 'recoil';

import ColumnHeader from '../../../components/column-header/ColumnHeader';
import { CountSeparator } from '../../../components/count-separator/CountSeparator';
import RetroItem from '../../../components/retro-item/RetroItem';
import TextField from '../../../components/text-field/TextField';
import ThoughtService, { getCreateThoughtResponse } from '../../../services/api/ThoughtService';
import { ColumnTitleByTopicState } from '../../../state/ColumnTitleState';
import { TeamState } from '../../../state/TeamState';
import { ActiveThoughtsByTopicState, DiscussedThoughtsState, ThoughtTopic } from '../../../state/ThoughtsState';
import Thought from '../../../types/Thought';

import './RetroColumn.scss';

type Props = {
  topic: ThoughtTopic;
};

function RetroColumn(props: Props) {
  const { topic } = props;

  const team = useRecoilValue(TeamState);
  const columnTitle = useRecoilValue(ColumnTitleByTopicState(topic));
  const { title } = columnTitle;

  const activeThoughts = useRecoilValue<Thought[]>(ActiveThoughtsByTopicState(topic));
  const discussedThoughts = useRecoilValue<Thought[]>(DiscussedThoughtsState(topic));

  // const isActionItemsColumn = topic === ColumnTopic.ACTION;
  // const placeholder = isActionItemsColumn ? 'Enter an Action Item' : 'Enter a Thought';

  const createThought = (text: string) => {
    ThoughtService.create(team.id, getCreateThoughtResponse(team.id, topic, text)).catch(console.error);
  };

  const deleteThought = (thought: Thought) => {
    ThoughtService.delete(team.id, thought.id).catch(console.error);
  };

  const renderThought = (thought: Thought) => {
    return (
      <Fragment key={thought.id}>
        <RetroItem onDelete={deleteThought} thought={thought as unknown as Thought} type={thought.topic} />
      </Fragment>
    );
  };

  return (
    <div className="retro-column" data-testid={`retroColumn__${topic}`}>
      <ColumnHeader initialTitle={title} type={topic} sortedChanged={() => undefined} titleChanged={() => undefined} />
      <TextField type={topic} placeholder="Enter a Thought" handleSubmission={createThought} />
      <CountSeparator count={activeThoughts.length} />
      {activeThoughts.map(renderThought)}
      {discussedThoughts.map(renderThought)}
    </div>
  );
}

export default RetroColumn;
