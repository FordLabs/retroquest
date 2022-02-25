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
import { useRecoilState, useSetRecoilState } from 'recoil';

import MobileColumnNav from '../../components/mobile-column-nav/MobileColumnNav';
import useWebSocketMessageHandler from '../../hooks/useWebSocketMessageHandler';
import ActionItemService from '../../services/api/ActionItemService';
import ColumnService from '../../services/api/ColumnService';
import WebSocketService from '../../services/websocket/WebSocketService';
import { ActionItemState } from '../../state/ActionItemState';
import { ColumnTitleState } from '../../state/ColumnTitleState';
import { TeamState } from '../../state/TeamState';
import { ThoughtsState } from '../../state/ThoughtsState';
import Action from '../../types/Action';
import { ColumnTitle } from '../../types/ColumnTitle';
import Team from '../../types/Team';
import Thought from '../../types/Thought';
import Topic, { ThoughtTopic } from '../../types/Topic';

import ActionItemsColumn from './action-items-column/ActionItemsColumn';
import RetroSubheader from './retro-sub-header/RetroSubheader';
import ThoughtColumn from './thought-column/ThoughtColumn';

type Props = {
  teamId?: string;
};

function RetroPage(props: Props): ReactElement {
  const { teamId } = props;

  const [team, setTeam] = useRecoilState<Team>(TeamState);
  const [columnTitles, setColumnTitles] = useRecoilState<ColumnTitle[]>(ColumnTitleState);
  const setActionItems = useSetRecoilState<Action[]>(ActionItemState);
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

    setTeam({ ...team, id: teamId });

    const getColumnsResult = ColumnService.getColumns(teamId);
    const getActionItemsResult = ActionItemService.get(teamId, false);

    Promise.all([getColumnsResult, getActionItemsResult]).then((results) => {
      const columns = results[0];
      setColumnTitles(
        columns.map((aggregatedColumn) => ({
          id: aggregatedColumn.id,
          topic: aggregatedColumn.topic,
          title: aggregatedColumn.title,
          teamId,
        }))
      );

      const actionItems = results[1];
      setActionItems(actionItems);

      const allItems = flatten(columns.map((aggregatedColumn) => aggregatedColumn.thoughts));
      setThoughts([...allItems.filter((item) => item.topic !== Topic.ACTION)]);

      setIsLoading(false);
    });
  }, []);

  function flatten(arr) {
    return arr.reduce(function (flat, toFlatten) {
      return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
  }

  useEffect(() => {
    if (!isLoading) {
      if (isMobileView()) addTouchListeners();

      WebSocketService.connect(() => {
        if (teamId) {
          WebSocketService.subscribeToColumnTitle(teamId, columnTitleMessageHandler);
          WebSocketService.subscribeToThoughts(teamId, thoughtMessageHandler);
          WebSocketService.subscribeToActionItems(teamId, actionItemMessageHandler);
          WebSocketService.subscribeToEndRetro(teamId, endRetroMessageHandler);
        }
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
        if (currentIndex < columnTitles.length) return currentIndex + 1;
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

  return (
    <div className="retro-page">
      <RetroSubheader />
      <div className="retro-page-content" ref={retroPageContentRef}>
        {!isLoading &&
          columnTitles.map(({ topic }: ColumnTitle, index) => {
            return (
              <div
                key={`column-${index}`}
                className={classNames('column-container', { selected: index === selectedMobileColumnIndex })}
              >
                <ThoughtColumn topic={topic as ThoughtTopic} />
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
        columnTitles={columnTitles}
        selectedIndex={selectedMobileColumnIndex}
        setSelectedIndex={setSelectedMobileColumnIndex}
      />
    </div>
  );
}

export default RetroPage;
