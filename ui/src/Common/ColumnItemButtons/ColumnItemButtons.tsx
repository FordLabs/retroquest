/*
 * Copyright (c) 2022 Ford Motor Company
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
import {
	ComponentPropsWithoutRef,
	forwardRef,
	LegacyRef,
	PropsWithChildren,
} from 'react';
import classnames from 'classnames';

import Tooltip from '../Tooltip/Tooltip';

import './ColumnItemButtons.scss';

type ButtonProps = ComponentPropsWithoutRef<'button'>;

export const EditButton = forwardRef(
	(props: ButtonProps, ref: LegacyRef<HTMLButtonElement>) => {
		const { className, ...buttonProps } = props;

		return (
			<button
				className={classnames('column-item-button', className)}
				{...buttonProps}
				ref={ref}
				data-testid="editButton"
			>
				<i className="fas fa-edit" aria-hidden="true" data-testid="editIcon" />
				<Tooltip>Edit</Tooltip>
			</button>
		);
	}
);

export const DeleteButton = forwardRef(
	(props: ButtonProps, ref: LegacyRef<HTMLButtonElement>) => {
		const { ...buttonProps } = props;

		return (
			<button
				className="column-item-button"
				{...buttonProps}
				ref={ref}
				data-testid="deleteButton"
			>
				<i
					className="fas fa-trash"
					aria-hidden="true"
					data-testid="trashIcon"
				/>
				<Tooltip>Delete</Tooltip>
			</button>
		);
	}
);

type CheckmarkButtonProps = ButtonProps & {
	checked: boolean;
};

export const CheckboxButton = forwardRef(
	(props: CheckmarkButtonProps, ref: LegacyRef<HTMLButtonElement>) => {
		const { checked, className, ...buttonProps } = props;

		return (
			<button
				className={classnames('column-item-button', className)}
				{...buttonProps}
				ref={ref}
				data-testid="checkboxButton"
			>
				<div className={classnames('checkbox', { checked })}>
					<div className="checkbox-border" data-testid="checkbox" />
					{checked && (
						<i
							className="fas fa-check"
							aria-hidden="true"
							data-testid="checkmark"
						/>
					)}
				</div>
				<Tooltip>{checked ? 'Open' : 'Close'}</Tooltip>
			</button>
		);
	}
);

export const ConfirmButton = forwardRef(
	(props: ButtonProps, ref: LegacyRef<HTMLButtonElement>) => {
		const { className, children, ...buttonProps } = props;

		return (
			<button
				className={classnames('column-item-button button-primary', className)}
				{...buttonProps}
				ref={ref}
			>
				{children}
			</button>
		);
	}
);

export const CancelButton = forwardRef(
	(props: ButtonProps, ref: LegacyRef<HTMLButtonElement>) => {
		const { className, children, ...buttonProps } = props;

		return (
			<button
				className={classnames('column-item-button button-secondary', className)}
				{...buttonProps}
				ref={ref}
			>
				{children}
			</button>
		);
	}
);

export function ColumnItemButtonGroup(props: PropsWithChildren<unknown>) {
	return <div className="column-item-button-group">{props.children}</div>;
}
