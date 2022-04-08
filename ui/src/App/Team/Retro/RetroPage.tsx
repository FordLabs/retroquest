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

import React, {
	ReactElement,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';
import classNames from 'classnames';
import Hammer from 'hammerjs';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import useWebSocketMessageHandler from '../../../Hooks/useWebSocketMessageHandler';
import ActionItemService from '../../../Services/Api/ActionItemService';
import ColumnService from '../../../Services/Api/ColumnService';
import ThoughtService from '../../../Services/Api/ThoughtService';
import DragAndDrop from '../../../Services/DragAndDrop/DragAndDrop';
import WebSocketController from '../../../Services/Websocket/WebSocketController';
import WebSocketService from '../../../Services/Websocket/WebSocketService';
import { ActionItemState } from '../../../State/ActionItemState';
import { ColumnsState } from '../../../State/ColumnsState';
import { TeamState } from '../../../State/TeamState';
import { ThoughtsState } from '../../../State/ThoughtsState';
import Action from '../../../Types/Action';
import { Column } from '../../../Types/Column';
import Team from '../../../Types/Team';
import Thought from '../../../Types/Thought';

import ActionItemsColumn from './ActionItemsColumn/ActionItemsColumn';
import MobileColumnNav from './MobileColumnNav/MobileColumnNav';
import RetroSubheader from './RetroSubheader/RetroSubheader';
import ThoughtsColumn from './ThoughtsColumn/ThoughtsColumn';

import './RetroPage.scss';

function RetroPage(): ReactElement {
	const team = useRecoilValue<Team>(TeamState);
	const [webSocket] = useState<WebSocketService>(
		new WebSocketService(WebSocketController.getClient())
	);
	const setActionItems = useSetRecoilState<Action[]>(ActionItemState);
	const [columns, setColumns] = useRecoilState<Column[]>(ColumnsState);
	const setThoughts = useSetRecoilState<Thought[]>(ThoughtsState);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [selectedMobileColumnIndex, setSelectedMobileColumnIndex] = useState(0);

	const retroPageContentRef = useRef(null);
	const isMobileView = (): boolean => window.innerWidth <= 610;

	const {
		columnTitleMessageHandler,
		thoughtMessageHandler,
		actionItemMessageHandler,
		endRetroMessageHandler,
	} = useWebSocketMessageHandler();

	const addTouchListeners = useCallback(() => {
		const pageGestures = new Hammer(retroPageContentRef.current!);

		pageGestures.on('swipeleft', () => {
			setSelectedMobileColumnIndex((currentIndex) => {
				if (currentIndex < columns.length) return currentIndex + 1;
				return currentIndex;
			});
		});
		pageGestures.on('swiperight', () => {
			setSelectedMobileColumnIndex((currentIndex) => {
				if (currentIndex > 0) return currentIndex - 1;
				return currentIndex;
			});
		});
	}, [columns.length]);

	useEffect(() => {
		if (team.id) {
			const getColumnsResult = ColumnService.getColumns(team.id);
			const getThoughtsResult = ThoughtService.getThoughts(team.id);
			const getActionItemsResult = ActionItemService.get(team.id, false);

			Promise.all([
				getColumnsResult,
				getThoughtsResult,
				getActionItemsResult,
			]).then((results) => {
				setColumns(results[0]);
				setThoughts(results[1]);
				setActionItems(results[2]);
				setIsLoading(false);
			});
		}
	}, [team.id, setActionItems, setThoughts, setColumns]);

	useEffect(() => {
		if (!isLoading) {
			if (isMobileView()) addTouchListeners();
			webSocket.connect(() => {
				webSocket.subscribeToColumnTitle(team.id, columnTitleMessageHandler);
				webSocket.subscribeToThoughts(team.id, thoughtMessageHandler);
				webSocket.subscribeToActionItems(team.id, actionItemMessageHandler);
				webSocket.subscribeToEndRetro(team.id, endRetroMessageHandler);
			});

			return () => {
				webSocket.disconnect();
			};
		}
	}, [
		isLoading,
		team.id,
		columnTitleMessageHandler,
		thoughtMessageHandler,
		actionItemMessageHandler,
		endRetroMessageHandler,
		addTouchListeners,
		webSocket,
	]);

	useEffect(() => {
		setTimeout(() => {
			(
				retroPageContentRef.current as unknown as HTMLDivElement
			)?.classList.remove('stop-animations');
		}, 1000);
	}, []);

	return (
		<div className="retro-page">
			<RetroSubheader />
			<div
				className="retro-page-content stop-animations"
				ref={retroPageContentRef}
				data-testid="retroPageContent"
			>
				{!isLoading && (
					<>
						<DragAndDrop>
							{columns.map((column, index) => {
								return (
									<div
										key={`column-${index}`}
										className={classNames('column-container', {
											selected: index === selectedMobileColumnIndex,
										})}
									>
										<ThoughtsColumn column={column} />
									</div>
								);
							})}
						</DragAndDrop>
						<div
							className={classNames('column-container', {
								selected: 3 === selectedMobileColumnIndex,
							})}
						>
							<ActionItemsColumn />
						</div>
					</>
				)}
			</div>
			<MobileColumnNav
				columns={columns}
				selectedIndex={selectedMobileColumnIndex}
				setSelectedIndex={setSelectedMobileColumnIndex}
			/>
		</div>
	);
}

export default RetroPage;
