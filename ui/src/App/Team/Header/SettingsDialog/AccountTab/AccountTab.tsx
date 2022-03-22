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

import * as React from 'react';

import useAuth from '../../../../../Hooks/useAuth';

import './AccountTab.scss';

function AccountTab(): JSX.Element {
	const { logout } = useAuth();

	return (
		<div className="tab-body account-tab-body">
			<button onClick={logout} className="logout-button button-primary">
				Logout
			</button>
		</div>
	);
}

export default AccountTab;
