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
import { screen, waitFor, within } from '@testing-library/react';

import BoardService from '../../../../../Services/Api/BoardService';
import { TeamState } from '../../../../../State/TeamState';
import Retro from '../../../../../Types/Retro';
import Topic from '../../../../../Types/Topic';
import renderWithRecoilRoot from '../../../../../Utils/renderWithRecoilRoot';

import ArchivedBoard from './ArchivedBoard';

jest.mock('Services/Api/BoardService');

describe('Archived Board', () => {
	beforeEach(() => {
		BoardService.getBoard = jest.fn().mockResolvedValue(mockFullBoard);
	});

	it('should display columns', async () => {
		await setupComponent(mockFullBoard.id);
		const columns = getColumns();
		expect(within(columns[0]).getByText('Happy')).toBeDefined();
		expect(within(columns[1]).getByText('Confused')).toBeDefined();
		expect(within(columns[2]).getByText('Sad')).toBeDefined();
	});

	it('should display thoughts for column', async () => {
		await setupComponent(mockFullBoard.id);
		const columns = getColumns();
		expect(within(columns[0]).getByText('I am a message4')).toBeDefined();
		expect(within(columns[0]).getByText('I am a message1')).toBeDefined();
		expect(within(columns[1]).getByText('I am a message2')).toBeDefined();
		expect(within(columns[1]).getByText('I am a message3')).toBeDefined();
	});

	it('should display number of thoughts per column', async () => {
		await setupComponent(mockFullBoard.id);
		const columns = getColumns();
		expect(within(columns[0]).getByText('2')).toBeDefined();
		expect(within(columns[1]).getByText('2')).toBeDefined();
	});

	it('should display thought heart count', async () => {
		await setupComponent(mockFullBoard.id);
		const thought = screen.getByTestId('thought100');
		expect(within(thought).getByText('20')).toBeDefined();
	});

	it('should display Not Discussed if thought was not discussed', async () => {
		await setupComponent(mockFullBoard.id);
		const thought = screen.getByTestId('thought100');
		expect(within(thought).getByText('Not Discussed')).toBeDefined();
	});

	it('should display Discussed if thought was discussed', async () => {
		await setupComponent(mockFullBoard.id);
		const thought = screen.getByTestId('thought102');
		expect(within(thought).getByText('Discussed')).toBeDefined();
	});

	it('should display thoughts in order by discussion status and then thought count', async () => {
		BoardService.getBoard = jest
			.fn()
			.mockResolvedValue(singleColumnFullRetroBoard);
		await setupComponent(singleColumnFullRetroBoard.id);
		const thoughts = screen.getAllByTestId(/thought/);
		expect(within(thoughts[0]).getByText('I am a message4')).toBeDefined();
		expect(within(thoughts[1]).getByText('I am a message1')).toBeDefined();
		expect(within(thoughts[2]).getByText('I am a message2')).toBeDefined();
		expect(within(thoughts[3]).getByText('I am a message3')).toBeDefined();
	});
});

async function setupComponent(boardId: number) {
	renderWithRecoilRoot(<ArchivedBoard boardId={boardId} />, ({ set }) => {
		set(TeamState, { name: 'Name', id: 'team-id' });
	});

	await waitFor(() =>
		expect(BoardService.getBoard).toHaveBeenCalledWith('team-id', boardId)
	);
}

function getColumns() {
	return screen.getAllByTestId('archived-column');
}

const mockFullBoard: Retro = {
	dateCreated: new Date(),
	id: 1,
	teamId: 'team-id',
	thoughts: [
		{
			id: 100,
			message: 'I am a message1',
			hearts: 20,
			discussed: false,
			columnId: 10,
		},
		{
			id: 101,
			message: 'I am a message2',
			hearts: 30,
			discussed: false,
			columnId: 11,
		},
		{
			id: 102,
			message: 'I am a message3',
			hearts: 10,
			discussed: true,
			columnId: 11,
		},
		{
			id: 103,
			message: 'I am a message4',
			hearts: 10,
			discussed: false,
			columnId: 10,
		},
	],
	columns: [
		{
			id: 10,
			title: 'Happy',
			topic: Topic.HAPPY,
		},
		{
			id: 11,
			title: 'Confused',
			topic: Topic.CONFUSED,
		},
		{
			id: 12,
			title: 'Sad',
			topic: Topic.UNHAPPY,
		},
	],
};

const singleColumnFullRetroBoard: Retro = {
	dateCreated: new Date(),
	id: 1,
	teamId: 'team-id',
	thoughts: [
		{
			id: 100,
			message: 'I am a message1',
			hearts: 10,
			discussed: false,
			columnId: 10,
		},
		{
			id: 101,
			message: 'I am a message2',
			hearts: 30,
			discussed: true,
			columnId: 10,
		},
		{
			id: 102,
			message: 'I am a message3',
			hearts: 10,
			discussed: true,
			columnId: 10,
		},
		{
			id: 103,
			message: 'I am a message4',
			hearts: 20,
			discussed: false,
			columnId: 10,
		},
	],
	columns: [
		{
			id: 10,
			title: 'Happy',
			topic: Topic.HAPPY,
		},
	],
};
