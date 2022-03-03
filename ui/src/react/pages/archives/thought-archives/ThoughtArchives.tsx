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
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useRecoilValue } from 'recoil';

import BoardService from '../../../services/api/BoardService';
import { TeamState } from '../../../state/TeamState';
import Board from '../../../types/Board';
import NoArchivesFoundSection from '../no-archives-found-section/NoArchivesFoundSection';

import ArchivedBoardTile from './ArchivedBoardTile';

import './ThoughtArchives.scss';

enum SortState {
  DateDescending,
  DateAscending,
}

function ThoughtArchives(): JSX.Element {
  const [boards, setBoards] = useState<Board[]>([]);
  const [sortState, setSortState] = useState<SortState>(SortState.DateDescending);
  const team = useRecoilValue(TeamState);

  useEffect(() => {
    BoardService.getBoards(team.id, 0).then((boards) => setBoards(boards.sort(sortByDateDescending)));
  }, [team.id]);

  function boardTile(board: Board) {
    return <ArchivedBoardTile key={board.teamId + board.dateCreated} board={board} />;
  }

  function handleDateSort() {
    if (sortState === SortState.DateDescending) {
      setBoards(boards.sort(sortByDateAscending));
      setSortState(SortState.DateAscending);
    } else {
      setBoards(boards.sort(sortByDateDescending));
      setSortState(SortState.DateDescending);
    }
  }

  function sortByDateDescending(a: Board, b: Board) {
    return moment(b.dateCreated).valueOf() - moment(a.dateCreated).valueOf();
  }

  function sortByDateAscending(a: Board, b: Board) {
    return moment(a.dateCreated).valueOf() - moment(b.dateCreated).valueOf();
  }

  return (
    <div className="thought-archives">
      {boards.length ? (
        <>
          <h1 className="title">Thought Archives</h1>
          <div>
            <button onClick={() => handleDateSort()}>Date</button>
          </div>
          <ol>{boards.map(boardTile)}</ol>
        </>
      ) : (
        <NoArchivesFoundSection>
          <>
            Boards will appear when retros are ended with <b>thoughts</b>.
          </>
        </NoArchivesFoundSection>
      )}
    </div>
  );
}

export default ThoughtArchives;
