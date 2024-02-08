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

import { ChangeEvent, useState } from 'react';
import classNames from 'classnames';

import './Checkbox.scss';

interface Props {
	id: string;
	label: string;
	value: string;
	className?: string;
	onChange(checked: boolean): void;
}

function Checkbox(props: Readonly<Props>) {
	const { id, label, value, className, onChange } = props;
	const [isChecked, setIsChecked] = useState<boolean>(false);

	function onCheckboxClick(event: ChangeEvent<HTMLInputElement>) {
		const { checked } = event.target;
		setIsChecked(checked);
		onChange(checked);
	}

	return (
		<label htmlFor={id} className={classNames('checkbox-container', className)}>
			<span>
				{isChecked ? (
					<i
						className="fa-solid fa-lg fa-square-check checkbox-icon"
						aria-hidden="true"
						data-testid="checkboxIcon"
					/>
				) : (
					<i
						className="fa-regular fa-lg fa-square checkbox-icon"
						aria-hidden="true"
						data-testid="checkboxIcon"
					/>
				)}
				<input
					id={id}
					className="checkbox-input"
					data-checked={isChecked}
					type="checkbox"
					value={value}
					onChange={onCheckboxClick}
				/>
			</span>
			<span className="label-text">{label}</span>
		</label>
	);
}

export default Checkbox;
