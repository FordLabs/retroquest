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

package com.ford.labs.retroquest.team;

import com.ford.labs.retroquest.actionitem.ActionItem;
import com.ford.labs.retroquest.column.Column;
import com.ford.labs.retroquest.thought.Thought;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;

import java.io.BufferedWriter;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CsvFile {

    private String teamName;
    private List<Thought> thoughts;
    private List<ActionItem> actionItems;
    private List<Column> columns;

    public String getFileName() {
        var today = LocalDate.now();
        return String.format("\"%s-retro-%d-%d-%d.csv\"", teamName, today.getMonthValue(), today.getDayOfMonth(), today.getYear());
    }

    public String getCsvString() throws IOException {
        var out = new ByteArrayOutputStream();
        var writer = new BufferedWriter(new OutputStreamWriter(out));

        var csvPrinter = new CSVPrinter(writer, CSVFormat.DEFAULT.withHeader("Column", "Message", "Likes", "Completed", "Assigned To"));
        Map<Long, String> columnNameMap = columns.stream().collect(Collectors.toMap(Column::getId, Column::getTitle));
        for (var thought : thoughts) {
            csvPrinter.printRecord(getFieldsFrom(thought, columnNameMap));
        }

        for (var actionItem : actionItems) {
            csvPrinter.printRecord(getFieldsFrom(actionItem));
        }

        csvPrinter.flush();
        return out.toString();
    }

    private List<String> getFieldsFrom(Thought thought, Map<Long, String> columnNameMap) {
        return List.of(
                columnNameMap.get(thought.getColumnId()),
                thought.getMessage(),
                String.valueOf(thought.getHearts()),
                getBooleanString(thought.isDiscussed())
        );
    }

    private List<String> getFieldsFrom(ActionItem actionItem) {
        return List.of(
                "action item",
                actionItem.getTask(),
                "",
                getBooleanString(actionItem.isCompleted()),
                getNullSafeString(actionItem.getAssignee())
        );
    }

    private String getBooleanString(boolean booleanToConvert) {
        return booleanToConvert ? "yes" : "no";
    }

    private String getNullSafeString(String stringToConvert) {
        return Objects.toString(stringToConvert, "");
    }

}
