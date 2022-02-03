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

import React, { useEffect, useRef } from 'react';

import { onKeys } from '../../utils/EventUtils';
import { CancelButton, ColumnItemButtonGroup, ConfirmButton } from '../column-item-buttons/ColumnItemButtons';

import './DeletionOverlay.scss';

type DeletionOverlayProps = React.PropsWithChildren<{
  onConfirm?: () => void;
  onCancel?: () => void;
}>;

export default function DeletionOverlay(props: DeletionOverlayProps) {
  const { onConfirm, onCancel, children } = props;

  useEffect(() => {
    cancelButtonRef.current?.focus();
    const escapeListener = onKeys('Escape', onCancel);
    document.addEventListener('keydown', escapeListener);

    return () => {
      document.removeEventListener('keydown', escapeListener);
    };
  }, [onCancel]);

  const cancelButtonRef = useRef<HTMLButtonElement>();

  return (
    <div className="deletion-overlay" data-testid="deletionOverlay">
      <div className="delete-message">{children}</div>
      <ColumnItemButtonGroup>
        <CancelButton onClick={onCancel} ref={cancelButtonRef}>
          No
        </CancelButton>
        <ConfirmButton onClick={onConfirm}>Yes</ConfirmButton>
      </ColumnItemButtonGroup>
    </div>
  );
}
