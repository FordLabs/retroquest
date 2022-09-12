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

import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import Modal from '../Common/Modal/Modal';
import { getThemeClassFromUserSettings, ThemeState } from '../State/ThemeState';

import CreatePage from './Create/CreatePage';
import LoginPage from './Login/LoginPage';
import ResetPasswordPage from './ResetPassword/ResetPasswordPage';
import ArchivesPage from './Team/Archives/ArchivesPage';
import ChangeTeamDetailsPage from './Team/Details/ChangeTeamDetailsPage';
import PasswordResetRequestPage from './Team/PasswordResetRequest/PasswordResetRequestPage';
import RadiatorPage from './Team/Radiator/RadiatorPage';
import RetroPage from './Team/Retro/RetroPage';
import TeamPages from './Team/TeamPages';

import '@fortawesome/fontawesome-free/css/all.css';
import '../Styles/main.scss';
import './App.scss';

export const PASSWORD_RESET_ROUTE = '/request-password-reset';

function App() {
	const theme = useRecoilValue(ThemeState);

	useEffect(() => {
		document.body.className = getThemeClassFromUserSettings();
	}, [theme]);

	return (
		<div className="retroquest-app" data-testid="retroquest-app">
			<Routes>
				<Route path="/" element={<Navigate replace to="/login" />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/login/:teamId" element={<LoginPage />} />
				<Route path="/create" element={<CreatePage />} />
				<Route path="/email/reset" element={<ChangeTeamDetailsPage />} />
				<Route path="/password/reset" element={<ResetPasswordPage />} />
				<Route
					path={PASSWORD_RESET_ROUTE}
					element={<PasswordResetRequestPage />}
				/>
				<Route path="/team/:teamId" element={<TeamPages />}>
					<Route path="" element={<RetroPage />} />
					<Route path="archives" element={<ArchivesPage />} />
					<Route path="radiator" element={<RadiatorPage />} />
				</Route>
			</Routes>
			<Modal />
		</div>
	);
}

export default App;
