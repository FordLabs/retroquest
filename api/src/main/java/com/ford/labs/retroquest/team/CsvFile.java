/*
 * Copyright © 2018 Ford Motor Company
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

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CsvFile {

    private String teamName;
    private List<Thought> thoughts;
    private List<ActionItem> actionItems;

    public String getFileName() {
        LocalDate today = LocalDate.now();
        return String.format("\"%s-retro-%d-%d-%d.csv\"", teamName, today.getMonthValue(), today.getDayOfMonth(), today.getYear());
    }

    public String getCSVString() throws IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(out));

        CSVPrinter csvPrinter = new CSVPrinter(writer, CSVFormat.DEFAULT
                .withHeader("Column", "Message", "Likes", "Completed", "Assigned To"));
        for (Thought thought: thoughts) {
            csvPrinter.printRecord(thought.getCSVFields());
        }

        for (ActionItem actionItem : actionItems) {
            csvPrinter.printRecord(actionItem.getCSVFields());
        }

        csvPrinter.flush();
        return new String(out.toByteArray());
    }

}
