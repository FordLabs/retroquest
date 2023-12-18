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
import { ComponentPropsWithoutRef } from 'react';
import classnames from 'classnames';

import './Input.scss';

type Props = ComponentPropsWithoutRef<'input'> & {
	value?: string;
	label?: string;
	invalid?: boolean;
	validationMessage?: string;
};

export default function Input(props: Readonly<Props>): React.ReactElement {
	const {
		id,
		label,
		value,
		onChange,
		invalid = false,
		className,
		validationMessage,
		type = 'text',
		...inputProps
	} = props;

	return (
		<div className={classnames('input-group', { invalid })} data-testid="input">
			{label && (
				<label className="input-label" htmlFor={id}>
					{label}
				</label>
			)}
			<input
				id={id}
				data-testid={id}
				className={classnames('input-element', className)}
				value={value}
				onChange={onChange}
				type={type}
				{...inputProps}
			/>
			{invalid && validationMessage && (
				<label
					htmlFor={id}
					className="validation-message"
					data-testid="inputValidationMessage"
				>
					{validationMessage}
				</label>
			)}
		</div>
	);
}
