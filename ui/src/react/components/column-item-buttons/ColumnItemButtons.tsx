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

import Tooltip from '../tooltip/Tooltip';

import './ColumnItemButtons.scss';

type ButtonProps = React.ComponentPropsWithoutRef<'button'>;

type EditButtonProps = ButtonProps & {
  editing: boolean;
};

export const EditButton = React.forwardRef((props: EditButtonProps, ref: React.LegacyRef<HTMLButtonElement>) => {
  const { editing, className, ...buttonProps } = props;

  return (
    <button className={classnames('column-item-button', className)} {...buttonProps} ref={ref}>
      {editing ? (
        <i className="fas fa-times" aria-hidden="true" data-testid="cancelIcon" />
      ) : (
        <i className="fas fa-edit" aria-hidden="true" data-testid="editIcon" />
      )}
      <Tooltip>{editing ? 'Cancel' : 'Edit'}</Tooltip>
    </button>
  );
});

export const DeleteButton = React.forwardRef((props: ButtonProps, ref: React.LegacyRef<HTMLButtonElement>) => {
  const { className, ...buttonProps } = props;

  return (
    <button className="column-item-button" {...buttonProps} ref={ref}>
      <i className="fas fa-trash" aria-hidden="true" data-testid="trashIcon" />
      <Tooltip>Delete</Tooltip>
    </button>
  );
});

type CheckmarkButtonProps = ButtonProps & {
  checked: boolean;
};

export const CheckboxButton = React.forwardRef(
  (props: CheckmarkButtonProps, ref: React.LegacyRef<HTMLButtonElement>) => {
    const { checked, className, ...buttonProps } = props;

    return (
      <button className={classnames('column-item-button', className)} {...buttonProps} ref={ref}>
        <div className={classnames('checkbox', { checked })}>
          <div className="checkbox-border" data-testid="checkbox" />
          {checked && <i className="fas fa-check" aria-hidden="true" data-testid="checkmark" />}
        </div>
        <Tooltip>{checked ? 'Open' : 'Close'}</Tooltip>
      </button>
    );
  }
);

export const ConfirmButton = React.forwardRef((props: ButtonProps, ref: React.LegacyRef<HTMLButtonElement>) => {
  const { className, children, ...buttonProps } = props;

  return (
    <button className={classnames('column-item-button primary', className)} {...buttonProps} ref={ref}>
      <span>{children}</span>
    </button>
  );
});

export const CancelButton = React.forwardRef((props: ButtonProps, ref: React.LegacyRef<HTMLButtonElement>) => {
  const { className, children, ...buttonProps } = props;

  return (
    <button className={classnames('column-item-button secondary', className)} {...buttonProps} ref={ref}>
      <span>{children}</span>
    </button>
  );
});

type ColumnItemButtonGroupProps = React.PropsWithChildren<{}>;

export function ColumnItemButtonGroup(props: ColumnItemButtonGroupProps) {
  const { children } = props;

  return <div className="column-item-button-group">{children}</div>;
}
