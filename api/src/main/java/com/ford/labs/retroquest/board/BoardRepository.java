/*
 * Copyright (c) 2021 Ford Motor Company
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

package com.ford.labs.retroquest.board;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long>, PagingAndSortingRepository<Board, Long> {
    List<Board> findAllByTeamIdOrderByDateCreatedDesc(String teamId, Pageable pageable);
    List<Board> findAllByTeamId(String teamId);
    Page<Board> findAllByTeamId(String teamId, Pageable pageable);
    Board findByIdAndTeamId(Long boardId, String teamId);

    @Transactional
    void deleteBoardByTeamIdAndId(String teamId, Long boardId);

    @Transactional
    void deleteBoardsByTeamIdAndIdIn(String teamId, List<Long> boardIds);
}
