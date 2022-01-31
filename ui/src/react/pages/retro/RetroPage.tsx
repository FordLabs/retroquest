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
import { useRecoilState } from 'recoil';

import useWebSocketMessageHandler from '../../hooks/useWebSocketMessageHandler';
import ColumnsService from '../../services/ColumnsService';
import { ColumnState } from '../../state/ColumnState';
import { TeamState } from '../../state/TeamState';
import { Column } from '../../types/Column';
import Team from '../../types/Team';
import WebSocketService from '../../websocket/WebSocketService';

import RetroColumn from './retro-column/RetroColumn';
import RetroSubHeader from './retro-sub-header/RetroSubHeader';

type Props = {
  teamId?: string;
};

function RetroPage(props: Props): ReactElement {
  const { teamId } = props;

  const [team, setTeam] = useRecoilState<Team>(TeamState);
  const [columns, setColumns] = useRecoilState<Column[]>(ColumnState);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { thoughtMessageHandler } = useWebSocketMessageHandler();

  useEffect(() => {
    setTeam({ ...team, id: teamId });

    ColumnsService.getColumns(teamId).then((newColumns) => {
      setColumns(newColumns);
      setIsLoading(false);
    });
  }, []);

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
          !!columns.length &&
          columns.map((column: Column, index) => {
            return (
              <Fragment key={`column-${index}`}>
                <RetroColumn column={column} />
              </Fragment>
            );
          })}
      </div>
    </div>
  );
}

export default RetroPage;
