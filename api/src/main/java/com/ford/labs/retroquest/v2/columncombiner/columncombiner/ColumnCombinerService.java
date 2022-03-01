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

package com.ford.labs.retroquest.v2.columncombiner.columncombiner;

import com.ford.labs.retroquest.actionitem.ActionItemRepository;
import com.ford.labs.retroquest.column.ColumnTitle;
import com.ford.labs.retroquest.column.ColumnTitleRepository;
import com.ford.labs.retroquest.thought.Thought;
import com.ford.labs.retroquest.thought.ThoughtRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class ColumnCombinerService {

    private final ThoughtRepository thoughtRepository;
    private final ActionItemRepository actionItemRepository;
    private final ColumnTitleRepository columnTitleRepository;

    public ColumnCombinerService(ThoughtRepository thoughtRepository, ActionItemRepository actionItemRepository,
                                 ColumnTitleRepository columnTitleRepository) {
        this.thoughtRepository = thoughtRepository;
        this.actionItemRepository = actionItemRepository;
        this.columnTitleRepository = columnTitleRepository;
    }

    public ColumnCombinerResponse aggregateResponse(String teamId) {
        var thoughts = thoughtRepository.findAllByTeamIdAndBoardIdIsNull(teamId);
        var actionItems = actionItemRepository.findAllByTeamIdAndArchived(teamId, false);
        var columnTitles = columnTitleRepository.findAllByTeamId(teamId);

        Map<ColumnTitle, List<Thought>> columnTitleListMap = columnTitles.stream().collect(
                Collectors.toMap(title -> title, title -> new ArrayList<>()));
        var groupedThoughts = thoughts.stream()
                .collect(Collectors.groupingBy(Thought::getColumnTitle));

        var mergedThoughts = mergeMaps(columnTitleListMap, groupedThoughts);

        var unorderedColumnResponses = buildColumnResponses(mergedThoughts);

        var actionItemColumnResponse = ColumnResponse.builder()
                .title("Action Items")
                .topic("action")
                .items(new ArrayList<>(actionItems))
                .build();

        var orderedColumns = unorderedColumnResponses.stream()
                .sorted(Comparator.comparing(ColumnResponse::getId))
                .collect(Collectors.toList());

        orderedColumns.add(actionItemColumnResponse);

        return ColumnCombinerResponse.builder()
                .columns(orderedColumns)
                .build();
    }

    private List<ColumnResponse<?>> buildColumnResponses(final Map<ColumnTitle, List<Thought>> mergedThoughts) {
        return mergedThoughts.entrySet().stream()
                    .map(iter -> ColumnResponse.builder()
                            .id(iter.getKey().getId())
                            .topic(iter.getKey().getTopic())
                            .title(iter.getKey().getTitle())
                            .items(new ArrayList<>(iter.getValue()))
                            .build())
                    .collect(Collectors.toList());
    }

    private Map<ColumnTitle, List<Thought>> mergeMaps(final Map<ColumnTitle, List<Thought>> columnTitleListMap,
                                                      final Map<ColumnTitle, List<Thought>> groupedThoughts) {
        return Stream.of(columnTitleListMap, groupedThoughts)
                    .flatMap(map -> map.entrySet().stream())
                    .collect(
                            Collectors.toMap(
                                    Map.Entry::getKey,
                                    Map.Entry::getValue,
                                    (v1, v2) -> {v1.addAll(v2); return v1;}
                            )
                    );
    }
}
