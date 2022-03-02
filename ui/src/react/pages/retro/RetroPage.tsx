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

import React, { ReactElement, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import Hammer from 'hammerjs';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import MobileColumnNav from '../../components/mobile-column-nav/MobileColumnNav';
import useWebSocketMessageHandler from '../../hooks/useWebSocketMessageHandler';
import ActionItemService from '../../services/api/ActionItemService';
import ColumnService from '../../services/api/ColumnService';
import ThoughtService from '../../services/api/ThoughtService';
import WebSocketService from '../../services/websocket/WebSocketService';
import { ActionItemState } from '../../state/ActionItemState';
import { ColumnsState } from '../../state/ColumnsState';
import { TeamState } from '../../state/TeamState';
import { ThoughtsState } from '../../state/ThoughtsState';
import Action from '../../types/Action';
import { Column } from '../../types/Column';
import Team from '../../types/Team';
import Thought from '../../types/Thought';

import ActionItemsColumn from './action-items-column/ActionItemsColumn';
import RetroSubheader from './retro-subheader/RetroSubheader';
import ThoughtColumn from './thought-column/ThoughtColumn';

function RetroPage(): ReactElement {
  const team = useRecoilValue<Team>(TeamState);
  const setActionItems = useSetRecoilState<Action[]>(ActionItemState);
  const [columns, setColumns] = useRecoilState<Column[]>(ColumnsState);
  const setThoughts = useSetRecoilState<Thought[]>(ThoughtsState);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedMobileColumnIndex, setSelectedMobileColumnIndex] = useState(0);

  const retroPageContentRef = useRef(null);
  const isMobileView = (): boolean => window.innerWidth <= 610;

  const { columnTitleMessageHandler, thoughtMessageHandler, actionItemMessageHandler, endRetroMessageHandler } =
    useWebSocketMessageHandler();

  useEffect(() => {
    if (window['Cypress']) {
      // @todo remove once angular is yeeted
      window['Cypress'].isReact = true;
    }

    const getColumnsResult = ColumnService.getColumns(team.id);
    const getThoughtsResult = ThoughtService.getThoughts(team.id);
    const getActionItemsResult = ActionItemService.get(team.id, false);

    Promise.all([getColumnsResult, getThoughtsResult, getActionItemsResult]).then((results) => {
      setColumns(results[0]);
      setThoughts(results[1]);
      setActionItems(results[2]);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (isMobileView()) addTouchListeners();

      WebSocketService.connect(() => {
        WebSocketService.subscribeToColumnTitle(team.id, columnTitleMessageHandler);
        WebSocketService.subscribeToThoughts(team.id, thoughtMessageHandler);
        WebSocketService.subscribeToActionItems(team.id, actionItemMessageHandler);
        WebSocketService.subscribeToEndRetro(team.id, endRetroMessageHandler);
      });
    }

    return () => {
      WebSocketService.disconnect();
    };
  }, [isLoading]);

  const addTouchListeners = () => {
    const pageGestures = new Hammer(retroPageContentRef.current);

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
  };

  useEffect(() => {
    setTimeout(() => {
      retroPageContentRef.current?.classList.remove('stop-animations');
    }, 1000);
  }, []);

  return (
    <div className="retro-page">
      <RetroSubheader />
      <div className="retro-page-content stop-animations" ref={retroPageContentRef} data-testid="retroPageContent">
        {!isLoading &&
          columns.map((column, index) => {
            return (
              <div
                key={`column-${index}`}
                className={classNames('column-container', { selected: index === selectedMobileColumnIndex })}
              >
                <ThoughtColumn column={column} />
              </div>
            );
          })}
        {!isLoading && (
          <div className={classNames('column-container', { selected: 3 === selectedMobileColumnIndex })}>
            <ActionItemsColumn />
          </div>
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
