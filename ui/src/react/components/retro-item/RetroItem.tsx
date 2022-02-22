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
import { useRef } from 'react';
import classnames from 'classnames';
import { useRecoilValue } from 'recoil';
import { ThoughtTopic } from 'src/react/types/Topic';

import ThoughtService from '../../services/api/ThoughtService';
import { TeamState } from '../../state/TeamState';
import Thought from '../../types/Thought';
import ColumnItem from '../column-item/ColumnItem';
import { ModalMethods } from '../modal/Modal';
import RetroItemModal from '../retro-item-modal/RetroItemModal';

import UpvoteButton from './upvote-button/UpvoteButton';

import './RetroItem.scss';

const NO_OP = () => undefined;
type AcceptThoughtFunction = (thought: Thought) => void;

type RetroItemProps = {
  thought: Thought;
  type: ThoughtTopic;
  readOnly?: boolean;
  onUpvote?: AcceptThoughtFunction;
};

export default function RetroItem(props: RetroItemProps) {
  const { thought, type, readOnly = false, onUpvote = NO_OP } = props;

  const team = useRecoilValue(TeamState);

  const retroItemModalRef = useRef<ModalMethods>();

  const editThought = (updatedThoughtMessage: string) => {
    ThoughtService.updateMessage(team.id, thought.id, updatedThoughtMessage).catch(console.error);
  };

  const updateThoughtDiscussionStatus = () => {
    ThoughtService.updateDiscussionStatus(team.id, thought.id, !thought.discussed).catch(console.error);
  };

  const deleteThought = () => {
    ThoughtService.delete(team.id, thought.id).catch(console.error);
  };

  return (
    <>
      <ColumnItem
        className={classnames('retro-item', { completed: thought.discussed })}
        data-testid="retroItem"
        type={type}
        text={thought.message}
        checked={thought.discussed}
        readOnly={readOnly}
        onSelect={() => retroItemModalRef.current?.show()}
        onEdit={editThought}
        onDelete={deleteThought}
        onCheck={updateThoughtDiscussionStatus}
        customButtons={({ editing, deleting }) => (
          <UpvoteButton
            votes={thought.hearts}
            onClick={() => onUpvote(thought)}
            disabled={thought.discussed || editing || deleting}
            readOnly={readOnly}
            aria-label={`Upvote (${thought.hearts})`}
            data-testid="retroItem-upvote"
          />
        )}
      />
      <RetroItemModal
        ref={retroItemModalRef}
        thought={thought}
        type={thought.topic}
        onUpvote={() => onUpvote(thought)}
        onEdit={editThought}
      />
    </>
  );
}
