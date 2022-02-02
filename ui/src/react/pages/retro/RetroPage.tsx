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
import ColumnsService from '../../services/ColumnsService';
import { ActionItemState } from '../../state/ActionItemState';
import { ColumnTitleState } from '../../state/ColumnTitleState';
import { TeamState } from '../../state/TeamState';
import { ThoughtsState } from '../../state/ThoughtsState';
import Action from '../../types/Action';
import { ColumnTitle } from '../../types/ColumnTitle';
import ColumnTopic from '../../types/ColumnTopic';
import Team from '../../types/Team';
import Thought, { ThoughtTopic } from '../../types/Thought';
import WebSocketService from '../../websocket/WebSocketService';

import RetroColumn from './retro-column/RetroColumn';
import RetroSubHeader from './retro-sub-header/RetroSubHeader';

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

  const { thoughtMessageHandler } = useWebSocketMessageHandler();

  useEffect(() => {
    setTeam({ ...team, id: teamId });

    ColumnsService.getColumns(teamId).then((aggregatedColumns) => {
      setColumnTitles(
        aggregatedColumns.map((aggregatedColumn) => ({
          id: aggregatedColumn.id,
          topic: aggregatedColumn.topic,
          title: aggregatedColumn.title,
          teamId,
        }))
      );

      const allItems = flatten(aggregatedColumns.map((aggregatedColumn) => aggregatedColumn.items));
      setThoughts([...allItems.filter((item) => item.topic !== ColumnTopic.ACTION)]);
      setActionItems([...allItems.filter((item) => item.topic === ColumnTopic.ACTION)]);

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
          WebSocketService.subscribeToThoughts(teamId, thoughtMessageHandler);
        }
      });
    }

    return () => {
      WebSocketService.disconnect();
    };
  }, [isLoading]);

  return (
    <div className="retro-page">
      <RetroSubHeader />
      <div className="retro-page-content">
        {!isLoading &&
          !!columnTitles.length &&
          columnTitles.map(({ topic }: ColumnTitle, index) => {
            return (
              <Fragment key={`column-${index}`}>
                <RetroColumn topic={topic as ThoughtTopic} />
              </Fragment>
            );
          })}
      </div>
    </div>
  );
}

export default RetroPage;
