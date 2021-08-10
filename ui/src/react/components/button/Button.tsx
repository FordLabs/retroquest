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

import './Button.scss';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

function Button(props: ButtonProps) {
  const { className, children, ...buttonProps } = props;

  const classNames = classnames('button', className);

  return (
    <button className={classNames} {...buttonProps}>
      <span className="button-text">{children}</span>
    </button>
  );
}

export function PrimaryButton(props: ButtonProps) {
  const { className, ...buttonProps } = props;

  const classNames = classnames('primary', className);

  return <Button className={classNames} {...buttonProps} />;
}

export function SecondaryButton(props: ButtonProps) {
  const { className, ...buttonProps } = props;

  const classNames = classnames('secondary', className);

  return <Button className={classNames} {...buttonProps} />;
}
