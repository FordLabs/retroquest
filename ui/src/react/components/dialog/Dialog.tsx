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

import { PrimaryButton, SecondaryButton } from '../button/Button';

import './Dialog.scss';

type DialogProps = React.PropsWithChildren<{
  className?: string;
  header: string;
  subHeader?: string;
  buttons?: {
    cancel?: {
      text: string;
      onClick: () => void;
    };
    confirm?: {
      text: string;
      onClick: () => void;
    };
  };
}>;

export default function Dialog(props: DialogProps) {
  const { header, subHeader, buttons, className, children } = props;

  return (
    <div className={classnames('dialog', className)}>
      <div className="dialog-body">
        <div className="dialog-heading">{header}</div>
        {subHeader && <div className="dialog-sub-heading">{subHeader}</div>}
        {children}
      </div>
      {buttons && (
        <div className="dialog-footer">
          {buttons.cancel && (
            <SecondaryButton onClick={buttons.cancel.onClick}>{buttons.cancel.text || 'cancel'}</SecondaryButton>
          )}
          {buttons.confirm && (
            <PrimaryButton onClick={buttons.confirm.onClick}>{buttons.confirm.text || 'confirm'}</PrimaryButton>
          )}
        </div>
      )}
    </div>
  );
}
