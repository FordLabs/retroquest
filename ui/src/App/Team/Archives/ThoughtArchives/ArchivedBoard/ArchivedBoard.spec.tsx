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
import { render, screen, within } from '@testing-library/react';

import Board from '../../../../../Types/Board';
import Topic from '../../../../../Types/Topic';

import ArchivedBoard from './ArchivedBoard';

describe('Archived Board', () => {
	it('should display columns', () => {
		render(<ArchivedBoard board={testBoard} />);
		const columns = screen.getAllByTestId('archived-column');
		expect(within(columns[0]).queryByText('Happy')).not.toBeNull();
		expect(within(columns[1]).queryByText('Sad')).not.toBeNull();
	});

	it('should display thoughts for column', () => {
		render(<ArchivedBoard board={testBoard} />);
		const columns = screen.getAllByTestId('archived-column');
		expect(within(columns[0]).queryByText('I am a message4')).not.toBeNull();
		expect(within(columns[0]).queryByText('I am a message1')).not.toBeNull();
		expect(within(columns[1]).queryByText('I am a message2')).not.toBeNull();
		expect(within(columns[1]).queryByText('I am a message3')).not.toBeNull();
	});

	it('should display number of thoughts per column', () => {
		render(<ArchivedBoard board={testBoard} />);
		const columns = screen.getAllByTestId('archived-column');
		expect(within(columns[0]).queryByText('2')).not.toBeNull();
		expect(within(columns[1]).queryByText('2')).not.toBeNull();
	});

	it('should display thought heart count', () => {
		render(<ArchivedBoard board={testBoard} />);
		const thought = screen.getByTestId('thought100');
		expect(within(thought).queryByText('20')).not.toBeNull();
	});

	it('should display Not Discussed if thought was not discussed', () => {
		render(<ArchivedBoard board={testBoard} />);
		const thought = screen.getByTestId('thought100');
		expect(within(thought).queryByText('Not Discussed')).not.toBeNull();
	});

	it('should display Discussed if thought was discussed', () => {
		render(<ArchivedBoard board={testBoard} />);
		const thought = screen.getByTestId('thought102');
		expect(within(thought).queryByText('Discussed')).not.toBeNull();
	});

	it('should display thoughts in order by discussion status and then thought count', () => {
		render(<ArchivedBoard board={singleColumnTestBoard} />);
		const thoughts = screen.getAllByTestId(/thought/);
		expect(within(thoughts[0]).queryByText('I am a message4')).not.toBeNull();
		expect(within(thoughts[1]).queryByText('I am a message1')).not.toBeNull();
		expect(within(thoughts[2]).queryByText('I am a message2')).not.toBeNull();
		expect(within(thoughts[3]).queryByText('I am a message3')).not.toBeNull();
	});
});

const testBoard: Board = {
	dateCreated: new Date(),
	id: 1,
	teamId: '',
	thoughts: [
		{
			id: 100,
			message: 'I am a message1',
			hearts: 20,
			discussed: false,
			topic: Topic.HAPPY,
			columnId: 10,
		},
		{
			id: 101,
			message: 'I am a message2',
			hearts: 30,
			discussed: false,
			topic: Topic.UNHAPPY,
			columnId: 11,
		},
		{
			id: 102,
			message: 'I am a message3',
			hearts: 10,
			discussed: true,
			topic: Topic.UNHAPPY,
			columnId: 11,
		},
		{
			id: 103,
			message: 'I am a message4',
			hearts: 10,
			discussed: false,
			topic: Topic.HAPPY,
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
			title: 'Sad',
			topic: Topic.UNHAPPY,
		},
	],
};

const singleColumnTestBoard: Board = {
	dateCreated: new Date(),
	id: 1,
	teamId: '',
	thoughts: [
		{
			id: 100,
			message: 'I am a message1',
			hearts: 10,
			discussed: false,
			topic: Topic.HAPPY,
			columnId: 10,
		},
		{
			id: 101,
			message: 'I am a message2',
			hearts: 30,
			discussed: true,
			topic: Topic.HAPPY,
			columnId: 10,
		},
		{
			id: 102,
			message: 'I am a message3',
			hearts: 10,
			discussed: true,
			topic: Topic.HAPPY,
			columnId: 10,
		},
		{
			id: 103,
			message: 'I am a message4',
			hearts: 20,
			discussed: false,
			topic: Topic.HAPPY,
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
