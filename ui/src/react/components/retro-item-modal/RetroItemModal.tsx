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
import { forwardRef, Ref, useEffect, useRef, useState } from 'react';
import classnames from 'classnames';

import Thought from '../../types/Thought';
import { ThoughtTopic } from '../../types/Topic';
import AddActionItem from '../action-item/add-action-item/AddActionItem';
import Modal, { ModalMethods } from '../modal/Modal';
import RetroItem from '../retro-item/RetroItem';

import './RetroItemModal.scss';

type RetroItemModalProps = {
  type: ThoughtTopic;
  thought: Thought;
  readOnly?: boolean;
  onUpvote?: () => void;
  onEdit?: (message: string) => void;
  onDelete?: () => void;
  onDiscuss?: () => void;
  onAction?: (task: string, assignee: string) => void;
};

function RetroItemModal(props: RetroItemModalProps, ref: Ref<ModalMethods>) {
  const { type, thought, readOnly, onUpvote, onEdit, onDelete, onDiscuss, onAction } = props;

  const [creatingActionItem, setCreatingActionItem] = useState(false);

  const addActionItemButtonRef = useRef<HTMLButtonElement>();

  useEffect(() => {
    if (!creatingActionItem) {
      addActionItemButtonRef.current?.focus();
    }
  }, [creatingActionItem]);

  function onCancel() {
    setCreatingActionItem(false);
  }

  function onConfirm(task, assignee) {
    setCreatingActionItem(false);
    onAction(task, assignee);
  }

  return (
    <Modal
      className={classnames('retro-item-modal', { 'creating-action': creatingActionItem })}
      onHide={() => setCreatingActionItem(false)}
      ref={ref}
    >
      <RetroItem
        thought={thought}
        readOnly={readOnly}
        onUpvote={onUpvote}
        onEdit={onEdit}
        onDelete={onDelete}
        onDiscuss={onDiscuss}
        type={type}
      />
      {!readOnly && !creatingActionItem && (
        <button
          className="add-action-item-button"
          onClick={() => setCreatingActionItem(true)}
          ref={addActionItemButtonRef}
        >
          <i className="fas fa-plus plus-icon" />
          Add Action Item
        </button>
      )}
      {creatingActionItem && <AddActionItem onConfirm={onConfirm} onCancel={onCancel} />}
    </Modal>
  );
}

export default forwardRef<ModalMethods, RetroItemModalProps>(RetroItemModal);
