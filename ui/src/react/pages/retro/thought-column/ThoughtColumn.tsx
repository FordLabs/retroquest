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
import { Fragment, useState } from 'react';
import { useRecoilValue } from 'recoil';

import ColumnHeader from '../../../components/column-header/ColumnHeader';
import { CountSeparator } from '../../../components/count-separator/CountSeparator';
import RetroItem from '../../../components/retro-item/RetroItem';
import TextField from '../../../components/text-field/TextField';
import ColumnService from '../../../services/api/ColumnService';
import ThoughtService from '../../../services/api/ThoughtService';
import { TeamState } from '../../../state/TeamState';
import { ActiveThoughtsByTopicState, DiscussedThoughtsByTopicState } from '../../../state/ThoughtsState';
import { getCreateThoughtRequest } from '../../../types/CreateThoughtRequest';
import Thought from '../../../types/Thought';
import { Column } from '../../../types/Column';

type Props = {
  column: Column;
};

function ThoughtColumn(props: Props) {
  const { column } = props;

  const team = useRecoilValue(TeamState);
  const [sorted, setSorted] = useState(false);
  const activeThoughts = useRecoilValue<Thought[]>(ActiveThoughtsByTopicState({ topic: column.topic, sorted }));
  const discussedThoughts = useRecoilValue<Thought[]>(DiscussedThoughtsByTopicState({ topic: column.topic, sorted }));

  const changeTitle = (title: string) => {
    ColumnService.updateColumnTitle(team.id, column.id, title).catch(console.error);
  };

  const createThought = (text: string) => {
    if (text && text.length) {
      ThoughtService.create(team.id, getCreateThoughtRequest(team.id, column.topic, text)).catch(console.error);
    }
  };

  const renderThought = (thought: Thought) => {
    return (
      <Fragment key={thought.id}>
        <RetroItem thought={thought} type={thought.topic} />
      </Fragment>
    );
  };

  return (
    <div className="retro-column" data-testid={`retroColumn__${column.topic}`}>
      <ColumnHeader
        initialTitle={column.title}
        type={column.topic}
        sortedChanged={setSorted}
        titleChanged={changeTitle}
      />
      <TextField type={column.topic} placeholder="Enter a Thought" handleSubmission={createThought} />
      <CountSeparator count={activeThoughts.length} />
      {activeThoughts.map(renderThought)}
      {discussedThoughts.map(renderThought)}
    </div>
  );
}

export default ThoughtColumn;
