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
import classnames from 'classnames';

import ColumnItem from '../column-item/ColumnItem';
import Tooltip from '../tooltip/Tooltip';
import ColumnType from '../../types/ColumnType';
import Thought from '../../types/Thought';

import './RetroItem.scss';

const NO_OP = () => undefined;

export type RetroItemType = ColumnType.HAPPY | ColumnType.CONFUSED | ColumnType.UNHAPPY;

type RetroItemProps = {
  thought: Thought;
  type: RetroItemType;
  readOnly?: boolean;
  onSelect?: () => void;
  onUpvote?: () => void;
  onEdit?: (message: string) => void;
  onDelete?: () => void;
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
      onDelete={onDelete}
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

type UpvoteButtonProps = React.ComponentPropsWithoutRef<'button'> & {
  votes: number;
  readOnly?: boolean;
};

function UpvoteButton(props: UpvoteButtonProps) {
  const { votes, disabled = false, readOnly = false, className, ...buttonProps } = props;

  return (
    <button
      {...buttonProps}
      className={classnames('column-item-button upvote-button', className, { readonly: readOnly })}
      disabled={disabled || readOnly}
    >
      <div className="star-icon">
        <i className="fas fa-star" aria-hidden="true" />
        <div className="star-shadow" />
      </div>
      <div className="star-count">{votes}</div>
      <Tooltip>Upvote</Tooltip>
    </button>
  );
}
