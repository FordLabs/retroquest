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

import {
  CheckboxButton,
  DeleteButton,
  EditButton,
  ColumnItemButtonGroup,
} from '../column-item-buttons/ColumnItemButtons';
import DeletionOverlay from '../deletion-overlay/DeletionOverlay';
import EditableText from '../editable-text/EditableText';
import ColumnType from '../../types/ColumnType';

import './ColumnItem.scss';

const NO_OP = () => undefined;

type ColumnItemProps = React.ComponentPropsWithoutRef<'div'> & {
  type: ColumnType;
  text: string;
  checked?: boolean;
  readOnly?: boolean;
  onSelect?: () => void;
  onEdit?: (message: string) => void;
  onDelete?: () => void;
  onCheck?: () => void;
  defaultButtons?: boolean;
  customButtons?: (state?: { editing: boolean; deleting: boolean }) => React.ReactNode;
  children?: (state?: { editing: boolean; deleting: boolean }) => React.ReactNode;
};

export default function ColumnItem(props: ColumnItemProps) {
  const {
    type,
    text,
    checked = false,
    readOnly = false,
    onSelect,
    onEdit = NO_OP,
    onDelete = NO_OP,
    onCheck = NO_OP,
    defaultButtons = true,
    customButtons,
    children,
    className,
    ...divProps
  } = props;

  const editButtonRef = React.useRef<HTMLButtonElement>();
  const deleteButtonRef = React.useRef<HTMLButtonElement>();

  const [editing, setEditing] = React.useState<boolean>();
  const [deleting, setDeleting] = React.useState<boolean>();

  const canSelect = ((!editing && !deleting && !checked) || readOnly) && !!onSelect;

  function onEditToggle() {
    return setEditing((editing) => !editing);
  }

  function onEditCanceled() {
    setEditing(false);
    editButtonRef.current?.focus();
  }

  function onEditConfirmed(text: string) {
    onEdit(text);
    setEditing(false);
  }

  function onDeleteStarted() {
    setDeleting(true);
  }

  function onDeleteConfirmed() {
    setDeleting(false);
    onDelete();
  }

  function onDeleteCanceled() {
    setDeleting(false);
    deleteButtonRef.current.disabled = false;
    deleteButtonRef.current?.focus();
  }

  function onTextSelect() {
    if (canSelect) onSelect();
  }

  return (
    <div
      data-testid="columnItem"
      className={classnames('column-item', type, className, {
        editing,
        deleting,
      })}
      {...divProps}
    >
      <EditableText
        value={text}
        editing={editing}
        selectable={canSelect}
        onConfirm={onEditConfirmed}
        onCancel={onEditCanceled}
        onSelect={onTextSelect}
        className="text-container"
        data-testid="columnItem-text"
      />

      {children && children({ editing, deleting })}

      <ColumnItemButtonGroup>
        {customButtons && customButtons({ editing, deleting })}
        {defaultButtons && (
          <>
            <EditButton
              editing={editing}
              onClick={onEditToggle}
              disabled={checked || readOnly || deleting}
              ref={editButtonRef}
              data-testid="columnItem-edit"
            />
            <DeleteButton
              onClick={onDeleteStarted}
              disabled={readOnly || editing || deleting}
              ref={deleteButtonRef}
              data-testid="columnItem-delete"
            />
            <CheckboxButton
              checked={checked}
              onClick={onCheck}
              disabled={readOnly || editing || deleting}
              data-testid="columnItem-checkbox"
            />
          </>
        )}
      </ColumnItemButtonGroup>

      {deleting && (
        <DeletionOverlay onCancel={onDeleteCanceled} onConfirm={onDeleteConfirmed}>
          Delete this {type === ColumnType.ACTION ? 'Action Item' : 'Thought'}?
        </DeletionOverlay>
      )}
    </div>
  );
}
