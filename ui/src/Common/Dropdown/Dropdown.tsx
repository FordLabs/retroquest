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

import './Dropdown.scss';

export interface DropdownOption {
	label: string;
	value: number;
}

interface Props {
	label: string;
	options: DropdownOption[];
	defaultValue: number;
	onChange: (value: string) => void;
}

function Dropdown(props: Props) {
	const { label, options, defaultValue, onChange } = props;

	return (
		<div className="dropdown">
			<label htmlFor="dropdown" className="visually-hidden">
				{label}
			</label>
			<select
				id="dropdown"
				data-testid="dropdown-select"
				name="section2"
				className="select"
				defaultValue={defaultValue}
				onChange={(event) => onChange(event.currentTarget.value)}
			>
				{options.map((option: DropdownOption) => (
					<option value={option.value} key={option.label}>
						{option.label}
					</option>
				))}
			</select>
			<i className="fas fa-sort-down select-arrow" />
		</div>
	);
}

export default Dropdown;
