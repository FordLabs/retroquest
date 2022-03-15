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

import * as React from 'react';
import { render, screen } from '@testing-library/react';

import Tooltip from './Tooltip';

describe('Tooltip', () => {
	it('should render', () => {
		render(<Tooltip>Hello World</Tooltip>);

		screen.getByText('Hello World');
	});

	it('should update parents style position to relative if it is static', () => {
		render(
			<span data-testid="container" style={{ position: 'static' }}>
				<Tooltip>Hello World</Tooltip>
			</span>
		);

		const container = screen.getByTestId('container');

		expect(container.style.position).toBe('relative');
	});

	it('should NOT update parents style position if it is not static', () => {
		render(
			<span data-testid="container" style={{ position: 'absolute' }}>
				<Tooltip>Hello World</Tooltip>
			</span>
		);

		const container = screen.getByTestId('container');

		expect(container.style.position).toBe('absolute');
	});
});
