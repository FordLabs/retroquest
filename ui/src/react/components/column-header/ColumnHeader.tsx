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

import React, { HTMLAttributes, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';

import { emojify } from '../../../app/modules/utils/EmojiGenerator';
import Topic from '../../types/Topic';
import { onChange, onEachKey } from '../../utils/EventUtils';
import FloatingCharacterCountdown from '../floating-character-countdown/FloatingCharacterCountdown';
import Tooltip from '../tooltip/Tooltip';

import './ColumnHeader.scss';

const maxTitleLength = 16;
const almostOutOfCharactersThreshold = 5;

interface ColumnHeaderProps extends HTMLAttributes<HTMLDivElement> {
  initialTitle?: string;
  type?: Topic;
  sortedChanged?: (changed: boolean) => void;
  titleChanged?: (title: string) => void;
}
function ColumnHeader(props: ColumnHeaderProps): JSX.Element {
  const { initialTitle = '', type = '', titleChanged, sortedChanged, ...divProps } = props;
  const [title, setTitle] = useState(initialTitle);
  const [editedTitle, setEditedTitle] = useState(initialTitle);
  const sortable = useMemo(() => sortedChanged !== undefined, [sortedChanged]);
  const editable = useMemo(() => titleChanged !== undefined, [titleChanged]);
  const [editing, setEditing] = useState(false);
  const [sorted, setSorted] = useState(false);

  useEffect(() => setTitle(initialTitle), [initialTitle]);

  const updateTitle = (newTitle: string) => {
    setTitle(newTitle);
    setEditing(false);
    titleChanged(newTitle);
  };

  const handleBlur = () => {
    updateTitle(editedTitle);
  };

  const handleKeyDown = onEachKey({
    Enter: () => updateTitle(editedTitle),
    Escape: () => setEditing(false),
  });

  const toggleSort = () => {
    const newSorted = !sorted;
    setSorted(newSorted);
    sortedChanged(newSorted);
  };

  const enableEditing = () => {
    setEditedTitle(title);
    setEditing(true);
  };

  const handleInputFocus = (event) => event.target.select();

  return (
    <div {...divProps} className={classNames('column-header', type)} data-testid={`columnHeader-${type}`}>
      {editing ? (
        <>
          <input
            type="text"
            data-testid="column-input"
            maxLength={maxTitleLength}
            value={editedTitle}
            onChange={onChange(setEditedTitle)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus={true}
            onFocus={handleInputFocus}
          />
          <FloatingCharacterCountdown
            characterCount={editedTitle.length}
            maxCharacterCount={maxTitleLength}
            charsAreRunningOutThreshold={almostOutOfCharactersThreshold}
          />
        </>
      ) : (
        <>
          <p className="display-text">{emojify(title)}</p>
          {sortable && (
            <div className="sort-container">
              <div
                data-testid="sort-button"
                className={classNames(['fas', 'fa-sort-down', 'sort'], { 'sort-icon-translucent': !sorted })}
                onClick={toggleSort}
              />
              <Tooltip>{sorted ? 'Unsort' : 'Sort'}</Tooltip>
            </div>
          )}
          {editable && (
            <span className={classNames(['edit-button'])}>
              <i
                className="fas fa-pencil-alt"
                onClick={enableEditing}
                aria-hidden="true"
                data-testid="columnHeader-editTitleButton"
              />
              <Tooltip>Edit</Tooltip>
            </span>
          )}
        </>
      )}
    </div>
  );
}

export default ColumnHeader;
