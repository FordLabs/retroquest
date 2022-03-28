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
import { render, screen, waitFor } from '@testing-library/react';
import { RecoilRoot } from 'recoil';

import {
	ModalContents,
	ModalContentsState,
} from '../../State/ModalContentsState';
import { RecoilObserver } from '../../Utils/RecoilObserver';

import Modal from './Modal';

describe('ModalContentsWrapper', () => {
	let modalContent: ModalContents | null;

	beforeEach(() => {
		modalContent = null;
	});

	const setupComponentWithModalContents = () => {
		render(
			<RecoilRoot
				initializeState={({ set }) => {
					set(ModalContentsState, {
						title: 'A Title',
						component: <div>Some Component</div>,
					});
				}}
			>
				<RecoilObserver
					recoilState={ModalContentsState}
					onChange={(value: ModalContents) => {
						modalContent = value;
					}}
				/>
				<Modal />
			</RecoilRoot>
		);
	};

	it('should show modal when modal contents exist', () => {
		setupComponentWithModalContents();

		expect(screen.getByText('A Title')).toBeDefined();
		expect(screen.getByText('Some Component')).toBeDefined();
	});

	it('should hide modal when modal contents is null', () => {
		render(
			<RecoilRoot
				initializeState={({ set }) => {
					set(ModalContentsState, null);
				}}
			>
				<Modal />
			</RecoilRoot>
		);

		expect(screen.queryByText('A Title')).toBeNull();
		expect(screen.queryByText('Some Component')).toBeNull();
	});

	it('should clear modal contents when close button is clicked', async () => {
		setupComponentWithModalContents();

		const closeModalButton = screen.getByLabelText('Close Modal');
		closeModalButton.click();

		await waitFor(() => expect(modalContent).toBeNull());
	});

	it('should clear modal contents when overlay is clicked', async () => {
		setupComponentWithModalContents();

		const modalOverlay = screen.getByTestId('modalOverlay');
		modalOverlay.click();

		await waitFor(() => expect(modalContent).toBeNull());
	});
});
