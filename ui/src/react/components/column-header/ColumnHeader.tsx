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
import classNames from 'classnames';

import Tooltip from '../tooltip/Tooltip';
import FloatingCharacterCountdown from '../floating-character-countdown/FloatingCharacterCountdown';
import { emojify } from '../../../app/modules/utils/EmojiGenerator';

import './ColumnHeader.scss';

const maxTitleLength = 16;
const almostOutOfCharactersThreshold = 5;

interface ColumnHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  initialTitle?: string;
  type?: string;
  readOnly?: boolean;

  sortedChanged: (changed: boolean) => void;
  titleChanged: (title: string) => void;
}

export default function ColumnHeader(props: ColumnHeaderProps): React.ReactElement {
  const { initialTitle = '', type = '', readOnly = false, titleChanged, sortedChanged, ...divProps } = props;
  const [title, setTitle] = React.useState(initialTitle);
  const [editedTitle, setEditedTitle] = React.useState(initialTitle);
  const [editing, setEditing] = React.useState(false);
  const [sorted, setSorted] = React.useState(false);

  const handleBlur = () => {
    updateTitle(editedTitle);
  };

  const handleTitleChange = (changeEvent) => {
    setEditedTitle(changeEvent.target.value);
  };

  const handleKeyDown = (keyPressEvent) => {
    if (keyPressEvent.key === 'Enter') updateTitle(editedTitle);
    else if (keyPressEvent.key === 'Escape') updateTitle(title);
  };

  const updateTitle = (newTitle: string) => {
    setTitle(newTitle);
    setEditing(false);
    titleChanged(newTitle);
  };

  const toggleSort = () => {
    const newSorted = !sorted;
    setSorted(newSorted);
    sortedChanged(newSorted);
  };

  const enableEditing = () => {
    setEditing(true);
  };

  const handleInputFocus = (event) => event.target.select();

  return (
    <div {...divProps} className={classNames('column-header', type)}>
      {editing && (
        <input
          type={'text'}
          data-testid={'column-input'}
          maxLength={maxTitleLength}
          value={editedTitle}
          onChange={handleTitleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus={true}
          onFocus={handleInputFocus}
        />
      )}
      {!editing && (
        <>
          <p className="display-text">{emojify(title)}</p>
          <div className="sort-container">
            <div
              data-testid="sort-button"
              className={classNames(['fas', 'fa-sort-down', 'sort'], { 'sort-icon-translucent': !sorted })}
              onClick={toggleSort}
            />
            <Tooltip>{sorted ? 'Unsort' : 'Sort'}</Tooltip>
          </div>
        </>
      )}
      {!readOnly && !editing && (
        <span className={classNames(['edit-button'])}>
          <i data-testid="edit-button" className="fas fa-pencil-alt" onClick={enableEditing} aria-hidden="true" />
          <Tooltip>Edit</Tooltip>
        </span>
      )}
      {editing && (
        <FloatingCharacterCountdown
          characterCount={editedTitle.length}
          maxCharacterCount={maxTitleLength}
          charsAreRunningOutThreshold={almostOutOfCharactersThreshold}
        />
      )}
    </div>
  );
}
