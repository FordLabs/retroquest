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
import { ThoughtTopic } from 'src/react/types/Topic';

import Thought from '../../types/Thought';
import ColumnItem from '../column-item/ColumnItem';

import UpvoteButton from './upvote-button/UpvoteButton';

import './RetroItem.scss';

const NO_OP = () => undefined;

type RetroItemProps = {
  thought: Thought;
  type: ThoughtTopic;
  readOnly?: boolean;
  onSelect?: () => void;
  onUpvote?: () => void;
  onEdit?: (message: string) => void;
  onDelete?: (thought: Thought) => void;
  onDiscuss?: () => void;
};

export default function RetroItem(props: RetroItemProps) {
  const {
    thought,
    type,
    readOnly = false,
    onSelect = NO_OP,
    onUpvote = NO_OP,
    onEdit = NO_OP,
    onDelete = NO_OP,
    onDiscuss = NO_OP,
  } = props;

  return (
    <ColumnItem
      className="retro-item"
      data-testid="retroItem"
      type={type}
      text={thought.message}
      checked={thought.discussed}
      readOnly={readOnly}
      onSelect={onSelect}
      onEdit={onEdit}
      onDelete={() => onDelete(thought)}
      onCheck={onDiscuss}
      customButtons={({ editing, deleting }) => (
        <UpvoteButton
          votes={thought.hearts}
          onClick={onUpvote}
          disabled={thought.discussed || editing || deleting}
          readOnly={readOnly}
          data-testid="retroItem-upvote"
        />
      )}
    />
  );
}
