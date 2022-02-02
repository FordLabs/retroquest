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

import { ColumnItem, ColumnItems, removeItemFromColumn } from './column-response';

describe('ColumnResponse', () => {

  it('should remove ColumnItem from List', () => {
    const item1 = {id: 1} as ColumnItem;
    const item2 = {id: 2} as ColumnItem;
    const columnItems: ColumnItems = [item1, item2];

    removeItemFromColumn(item1, columnItems);

    expect(columnItems).toHaveLength(1);
    expect(columnItems).toContain(item2);
  });

  it('should do nothing if item to remove does not exist', () => {
    const item1 = {id: 1} as ColumnItem;
    const missingItem = {id: 2} as ColumnItem;
    const columnItems: ColumnItems = [item1];

    removeItemFromColumn(missingItem, columnItems);

    expect(columnItems).toHaveLength(1);
    expect(columnItems).toContain(item1);
  });
});
