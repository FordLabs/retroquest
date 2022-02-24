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
import { Fragment, ReactElement, useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';

import useWebSocketMessageHandler from '../../hooks/useWebSocketMessageHandler';
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
import ActionItemService from '../../services/api/ActionItemService';

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

  const { columnTitleMessageHandler, thoughtMessageHandler, actionItemMessageHandler, endRetroMessageHandler } =
    useWebSocketMessageHandler();

  useEffect(() => {
    if (window['Cypress']) {
      // @todo remove once angular is yeeted
      window['Cypress'].isReact = true;
    }

    setTeam({ ...team, id: teamId });

    Promise.all([ColumnService.getColumns(teamId), ActionItemService.get(teamId, false)]).then((results) => {
      const columns = results[0];
      const actionItems = results[1];
      setColumnTitles(
        columns.map((aggregatedColumn) => ({
          id: aggregatedColumn.id,
          topic: aggregatedColumn.topic,
          title: aggregatedColumn.title,
          teamId,
        }))
      );

      const allItems = flatten(columns.map((aggregatedColumn) => aggregatedColumn.thoughts));
      setThoughts([...allItems.filter((item) => item.topic !== Topic.ACTION)]);
      setActionItems(actionItems);
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

  return (
    <div className="retro-page">
      <RetroSubheader />
      <div className="retro-page-content">
        {!isLoading &&
          columnTitles.map(({ topic }: ColumnTitle, index) => {
            return (
              <Fragment key={`column-${index}`}>
                <ThoughtColumn topic={topic as ThoughtTopic} />
              </Fragment>
            );
          })}
        {!isLoading && <ActionItemsColumn />}
      </div>
    </div>
  );
}

export default RetroPage;
