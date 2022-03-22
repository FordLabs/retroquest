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

import React, { FormEvent, PropsWithChildren } from 'react';
import classnames from 'classnames';

import './Dialog.scss';

type DialogProps = PropsWithChildren<{
	testId?: string;
	className?: string;
	title: string;
	subtitle?: string;
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
	const { title, subtitle, buttons, className, children, testId } = props;
	const DialogElement = !!buttons ? 'form' : 'div';

	const onSubmit = (event: FormEvent<HTMLFormElement | HTMLDivElement>) => {
		buttons?.confirm?.onClick();
		event.preventDefault();
	};

	return (
		<DialogElement
			className={classnames('dialog', className)}
			data-testid={testId}
			onSubmit={onSubmit}
		>
			<div className="dialog-body">
				<div className="dialog-title">{title}</div>
				{subtitle && <div className="dialog-subtitle">{subtitle}</div>}
				{children}
			</div>
			{buttons && (
				<div className="dialog-footer">
					{buttons.cancel && (
						<button
							type="button"
							onClick={buttons.cancel.onClick}
							className="dialog-button button-secondary"
						>
							{buttons.cancel.text || 'cancel'}
						</button>
					)}
					{buttons.confirm && (
						<button type="submit" className="dialog-button button-primary">
							{buttons.confirm.text || 'confirm'}
						</button>
					)}
				</div>
			)}
		</DialogElement>
	);
}
