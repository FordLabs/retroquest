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

import React, { FormEventHandler } from 'react';
import classnames from 'classnames';

import ButtonPrimary from '../ButtonPrimary/ButtonPrimary';
import ButtonSecondary from '../ButtonSecondary/ButtonSecondary';

import './FormTemplate.scss';

interface Props {
	testId?: string;
	className?: string;
	onSubmit: FormEventHandler;
	onCancel: () => void;
	children?: JSX.Element[] | JSX.Element;
	title: string;
	subtitle: string;
	cancelButtonText: string;
	submitButtonText: string;
}

function FormTemplate(props: Props) {
	const {
		testId,
		className,
		children,
		title,
		subtitle,
		onSubmit,
		onCancel,
		submitButtonText = 'Cancel',
		cancelButtonText = 'Submit!',
	} = props;

	return (
		<form
			className={classnames('form-template', className)}
			data-testid={testId}
			onSubmit={(event) => {
				event.preventDefault();
				onSubmit(event);
			}}
		>
			<div className="form-template-body">
				<div className="form-template-title">{title}</div>
				<div className="form-template-subtitle">{subtitle}</div>
				{children}
			</div>
			<div className="form-template-footer">
				<ButtonSecondary
					type="button"
					className="form-template-button"
					onClick={onCancel}
				>
					{cancelButtonText}
				</ButtonSecondary>
				<ButtonPrimary type="submit" className="form-template-button">
					{submitButtonText}
				</ButtonPrimary>
			</div>
		</form>
	);
}

export default FormTemplate;
