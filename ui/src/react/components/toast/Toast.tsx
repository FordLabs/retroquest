/*
 * Copyright (c) 2022. Ford Motor Company
 *  All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import * as React from 'react';
import classNames from 'classnames';

import './Toast.scss';

enum ToastLevel {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

interface Props {
  title: string;
  toastLevel?: ToastLevel;
  handleClose: () => void;
}

function Toast({
  title,
  children,
  handleClose,
  toastLevel = ToastLevel.ERROR,
}: React.PropsWithChildren<Props>): JSX.Element {
  return (
    <div className={classNames('toast', toastLevel)}>
      <div>
        <p className="title">{title}</p>
        <div className="content">{children}</div>
      </div>
      <button className="close-button" onClick={handleClose}>
        Close
      </button>
    </div>
  );
}

export { Toast, ToastLevel };
