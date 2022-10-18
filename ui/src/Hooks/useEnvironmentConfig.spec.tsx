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

import React, { ReactNode } from 'react';
import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { RecoilRoot } from 'recoil';
import ConfigurationService from 'Services/Api/ConfigurationService';

import { mockEnvironmentConfig } from '../Services/Api/__mocks__/ConfigurationService';
import { EnvironmentConfigState } from '../State/EnvironmentConfigState';
import EnvironmentConfig from '../Types/EnvironmentConfig';
import { RecoilObserver } from '../Utils/RecoilObserver';

import useEnvironmentConfig from './useEnvironmentConfig';

jest.mock('Services/Api/ConfigurationService');

describe('Use Environment Config', () => {
	let environmentConfig: EnvironmentConfig;

	const wrapper = ({ children }: { children: ReactNode }) => (
		<RecoilRoot>
			<RecoilObserver
				recoilState={EnvironmentConfigState}
				onChange={(value: EnvironmentConfig) => {
					environmentConfig = value;
				}}
			/>
			{children}
		</RecoilRoot>
	);

	it('should get environment config from the api and set global state', async () => {
		const { result } = renderHook(() => useEnvironmentConfig(), {
			wrapper: wrapper,
		});
		await waitFor(() => expect(ConfigurationService.get).toHaveBeenCalled());
		expect(environmentConfig).toEqual(mockEnvironmentConfig);
		expect(result.current).toEqual(mockEnvironmentConfig);
	});
});
