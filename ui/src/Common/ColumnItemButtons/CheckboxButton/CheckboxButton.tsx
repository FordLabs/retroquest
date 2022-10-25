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

import React, { ComponentPropsWithoutRef, forwardRef, LegacyRef } from 'react';
import classnames from 'classnames';
import Tooltip from 'Common/Tooltip/Tooltip';

import './CheckboxButton.scss';

interface CheckmarkButtonProps extends ComponentPropsWithoutRef<'button'> {
	checked: boolean;
	disableTooltips?: boolean;
}

const CheckboxButton = forwardRef(
	(props: CheckmarkButtonProps, ref: LegacyRef<HTMLButtonElement>) => {
		const { checked, className, disableTooltips, ...buttonProps } = props;

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
				{!disableTooltips && <Tooltip>{checked ? 'Open' : 'Close'}</Tooltip>}
			</button>
		);
	}
);

export default CheckboxButton;
