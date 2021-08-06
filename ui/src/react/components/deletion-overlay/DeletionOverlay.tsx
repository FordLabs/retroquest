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

import { PrimaryButton, SecondaryButton } from '../button/Button';

import './DeletionOverlay.scss';

type OverlayProps = React.PropsWithChildren<{
  onConfirm: () => void;
  onCancel: () => void;
}>;

export default function DeletionOverlay(props: OverlayProps): React.ReactElement {
  const { onConfirm, onCancel, children } = props;

  return (
    <div className="deletion-overlay">
      <input autoFocus={true} className="hidden-input" onBlur={onCancel} />
      <div className="heading">
        <p>{children}</p>
      </div>
      <div className="button-container">
        <SecondaryButton className="delete-decline-button" onMouseDown={(e) => e.preventDefault()} onClick={onCancel}>
          No
        </SecondaryButton>
        <PrimaryButton className="delete-accept-button" onMouseDown={(e) => e.preventDefault()} onClick={onConfirm}>
          Yes
        </PrimaryButton>
      </div>
    </div>
  );
}
