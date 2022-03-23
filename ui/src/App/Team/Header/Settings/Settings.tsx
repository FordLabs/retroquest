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
import classnames from 'classnames';

import Dialog from '../../../../Common/Dialog/Dialog';

import AccountTab from './AccountTab/AccountTab';
import InfoTab from './InfoTab/InfoTab';
import StylesTab from './StylesTab/StylesTab';

import './Settings.scss';

enum Tabs {
	STYLES = 'styles',
	ACCOUNT = 'account',
	INFO = 'info',
}

export function Settings() {
	const [tab, setTab] = useState<Tabs>(Tabs.STYLES);

	const stylesTabIsActive = () => tab === Tabs.STYLES;
	const accountTabIsActive = () => tab === Tabs.ACCOUNT;
	const infoTabIsActive = () => tab === Tabs.INFO;

	return (
		<Dialog
			className="settings-dialog"
			title="Settings"
			subtitle="choose your preferences"
		>
			<div className="tab-container">
				<div className="tab-heading">
					<button
						className={classnames('tab', { selected: stylesTabIsActive() })}
						onClick={() => setTab(Tabs.STYLES)}
					>
						Styles
					</button>
					<button
						className={classnames('tab', { selected: accountTabIsActive() })}
						onClick={() => setTab(Tabs.ACCOUNT)}
					>
						Account
					</button>
					<button
						className={classnames('tab', { selected: infoTabIsActive() })}
						onClick={() => setTab(Tabs.INFO)}
					>
						Info
					</button>
				</div>
				{stylesTabIsActive() && <StylesTab />}
				{accountTabIsActive() && <AccountTab />}
				{infoTabIsActive() && <InfoTab />}
			</div>
		</Dialog>
	);
}

export default Settings;
