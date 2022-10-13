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
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfigurationService from 'Services/Api/ConfigurationService';
import { ModalContents, ModalContentsState } from 'State/ModalContentsState';
import { RecoilObserver } from 'Utils/RecoilObserver';
import renderWithRecoilRoot from 'Utils/renderWithRecoilRoot';

import EmailSentConfirmation from './EmailSentConfirmation';

jest.mock('Services/Api/ConfigurationService');

describe('Email Sent Confirmation Modal', () => {
	let modalContent: ModalContents | null;

	it('should paragraph 1 as passed down as a prop', async () => {
		renderWithRecoilRoot(<EmailSentConfirmation paragraph1="Test Paragraph" />);
		await waitForConfigurationCall();
		expect(screen.getByText('Test Paragraph')).toBeInTheDocument();
	});

	it('should show "email sent from address" in paragraph 2', async () => {
		renderWithRecoilRoot(<EmailSentConfirmation paragraph1="" />);
		await waitForConfigurationCall();
		expect(
			screen.getByText(
				'If an email doesn’t show up soon, check your spam folder. We sent it from mock_email_from_address@email.com.'
			)
		).toBeInTheDocument();
	});

	it('should close modal when close button is clicked', async () => {
		renderWithRecoilRoot(
			<>
				<RecoilObserver
					recoilState={ModalContentsState}
					onChange={(value: ModalContents) => {
						modalContent = value;
					}}
				/>
				<EmailSentConfirmation paragraph1="" />
			</>,
			({ set }) => {
				set(ModalContentsState, { title: 'Test', component: <></> });
			}
		);
		await waitForConfigurationCall();
		userEvent.click(screen.getByText('Close'));
		await waitFor(() => expect(modalContent).toBeNull());
	});
});

async function waitForConfigurationCall() {
	await waitFor(() => expect(ConfigurationService.get).toHaveBeenCalled());
}
