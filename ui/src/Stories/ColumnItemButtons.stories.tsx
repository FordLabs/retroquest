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
import { ComponentMeta, ComponentStory } from '@storybook/react';
import {
	CancelButton,
	CheckboxButton,
	ColumnItemButtonGroup,
	ConfirmButton,
	DeleteButton,
	EditButton,
} from 'Common/ColumnItemButtons';

export default {
	title: 'components/ColumnItemButtons',
	component: ColumnItemButtonGroup,
} as ComponentMeta<typeof ColumnItemButtonGroup>;

const Template: ComponentStory<typeof ColumnItemButtonGroup> = () => {
	return (
		<div style={{ display: 'flex', flexDirection: 'column' }}>
			<div
				className="retro-item"
				style={{ width: '500px', marginBottom: '20px' }}
			>
				<ColumnItemButtonGroup>
					<EditButton onClick={() => alert('edit')} />
					<DeleteButton onClick={() => alert('delete')} />
					<CheckboxButton checked={false} onClick={() => alert('close')} />
				</ColumnItemButtonGroup>
			</div>

			<div
				className="retro-item"
				style={{ width: '500px', marginBottom: '20px' }}
			>
				<ColumnItemButtonGroup>
					<EditButton onClick={() => alert('cancel edit')} />
					<DeleteButton onClick={() => alert('delete')} />
					<CheckboxButton checked={true} onClick={() => alert('open')} />
				</ColumnItemButtonGroup>
			</div>

			<div
				className="retro-item"
				style={{ width: '500px', marginBottom: '20px' }}
			>
				<ColumnItemButtonGroup>
					<EditButton onClick={() => alert('edit')} disabled={true} />
					<DeleteButton onClick={() => alert('delete')} disabled={true} />
					<CheckboxButton
						checked={false}
						onClick={() => alert('close')}
						disabled={true}
					/>
					<CheckboxButton
						checked={true}
						onClick={() => alert('open')}
						disabled={true}
					/>
				</ColumnItemButtonGroup>
			</div>

			<div
				className="retro-item"
				style={{ width: '500px', marginBottom: '20px' }}
			>
				<ColumnItemButtonGroup>
					<EditButton onClick={() => alert('edit')} disabled={true} />
					<DeleteButton onClick={() => alert('delete')} disabled={true} />
					<CheckboxButton
						checked={false}
						onClick={() => alert('close')}
						disabled={true}
					/>
				</ColumnItemButtonGroup>
			</div>

			<div
				className="retro-item"
				style={{ width: '500px', marginBottom: '20px' }}
			>
				<ColumnItemButtonGroup>
					<CancelButton onClick={() => alert('cancel')}>Cancel</CancelButton>
					<ConfirmButton onClick={() => alert('confirm')}>
						Conform
					</ConfirmButton>
				</ColumnItemButtonGroup>
			</div>
		</div>
	);
};

export const Example = Template.bind({});
