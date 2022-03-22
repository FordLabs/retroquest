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

import React, { useState } from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import EditableText from '../Common/ColumnItem/EditableText/EditableText';

export default {
	title: 'components/EditableText',
	component: EditableText,
} as ComponentMeta<typeof EditableText>;

const testText =
	"If elevators hadn't been invented, all the CEOs and important people would have their offices on the first floor as a sign of status.";

const Template: ComponentStory<typeof EditableText> = () => {
	const [text, setText] = useState(testText);
	const [editing, setEditing] = useState(false);

	function onConfirm(message: string) {
		setText(message);
		setEditing(false);
	}

	function onCancel() {
		console.log('onCancel');
		setEditing(false);
	}

	function onSelect() {
		alert('selected');
	}

	return (
		<>
			<button
				className="button-primary"
				onClick={() =>
					setEditing((currentEditingState) => !currentEditingState)
				}
			>
				{editing ? 'Cancel Edit' : 'Edit'}
			</button>
			<div style={{ width: '400px', marginBottom: '20px' }}>
				<EditableText
					value={text}
					editing={editing}
					selectable={true}
					onConfirm={onConfirm}
					onCancel={onCancel}
					onSelect={onSelect}
				/>
			</div>
			<div style={{ width: '400px' }}>
				<EditableText
					value={testText}
					editing={false}
					selectable={true}
					onSelect={onSelect}
				/>
			</div>
		</>
	);
};

export const Example = Template.bind({});
