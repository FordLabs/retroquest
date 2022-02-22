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

import React, { forwardRef } from 'react';

import Action from '../../types/Action';
import ActionItem from '../action-item/ActionItem';
import Modal, { ModalMethods } from '../modal/Modal';

import './ActionItemModal.scss';

type ActionItemModalProps = {
  action: Action;
  readOnly?: boolean;
  onComplete?: () => void;
};

function ActionItemModal(props: ActionItemModalProps, ref: React.Ref<ModalMethods>) {
  const { action, readOnly, onComplete } = props;

  return (
    <Modal ref={ref} className="action-item-modal">
      <ActionItem action={action} readOnly={readOnly} onComplete={onComplete} />
    </Modal>
  );
}

export default forwardRef<ModalMethods, ActionItemModalProps>(ActionItemModal);
