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
import { PrimaryButton } from 'Common/Buttons/Button';
import useAuth from 'Hooks/useAuth';
import { useSetRecoilState } from 'recoil';
import { ModalContentsState } from 'State/ModalContentsState';

import './AccountTab.scss';

function AccountTab(): JSX.Element {
	const { logout } = useAuth();
	const setModalContents = useSetRecoilState(ModalContentsState);

	return (
		<div className="tab-body account-tab-body">
			<PrimaryButton
				onClick={() => {
					logout();
					setModalContents(null);
				}}
				className="logout-button"
			>
				Logout
			</PrimaryButton>
		</div>
	);
}

export default AccountTab;
