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

import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import ActionItemService from '../../../services/api/ActionItemService';
import { ActionItemState } from '../../../state/ActionItemState';
import { TeamState } from '../../../state/TeamState';

import './ActionItemArchives.scss';

function ActionItemArchives() {
  const team = useRecoilValue(TeamState);
  const [actionItems, setActionItems] = useRecoilState(ActionItemState);

  useEffect(() => {
    if (team.id) {
      ActionItemService.get(team.id, false)
        .then((items) => {
          setActionItems(items);
        })
        .catch(console.error);
    }
  }, [team.id]);

  return (
    <div className="action-item-archives">
      <h1 className="title">Action Item Archives</h1>
      <p>Examine completed action items from times gone by</p>
      <ul>
        {actionItems.map((actionItem) => {
          return (
            <li>
              <div>
                {actionItem.task}
                {actionItem.assignee}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ActionItemArchives;
