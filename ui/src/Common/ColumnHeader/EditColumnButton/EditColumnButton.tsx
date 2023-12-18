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

import React from 'react';
import Tooltip from 'Common/Tooltip/Tooltip';

import './EditColumnButton.scss';

interface Props {
	title: string;
	onClick(): void;
}

function EditColumnButton(props: Readonly<Props>) {
	const { title, onClick } = props;

	return (
		<button
			className="edit-button"
			onClick={onClick}
			aria-label={`Edit the "${title}" column title.`}
			data-testid="columnHeader-editTitleButton"
		>
			<i role="presentation" className="fas fa-pencil-alt" aria-hidden />
			<Tooltip>Edit</Tooltip>
		</button>
	);
}

export default EditColumnButton;
