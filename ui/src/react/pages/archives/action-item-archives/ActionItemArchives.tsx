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

import Assignee from '../../../components/action-item/assignee/Assignee';
import { DateCreated } from '../../../components/action-item/date-created/DateCreated';
import NotFoundSection from '../../../components/not-found-section/NotFoundSection';
import ActionItemService from '../../../services/api/ActionItemService';
import { ActionItemState } from '../../../state/ActionItemState';
import { TeamState } from '../../../state/TeamState';

import './ActionItemArchives.scss';

function ActionItemArchives() {
  const team = useRecoilValue(TeamState);
  const [actionItems, setActionItems] = useRecoilState(ActionItemState);

  useEffect(() => {
    if (team.id) {
      ActionItemService.get(team.id, true)
        .then((items) => {
          setActionItems(items);
        })
        .catch(console.error);
    }
  }, [team.id]);

  return (
    <div className="action-item-archives">
      {actionItems.length ? (
        <>
          <h1 className="action-item-archives-title">Action Item Archives</h1>
          <p className="action-item-archives-description">Examine completed action items from times gone by</p>
          <ul className="archived-action-items">
            {actionItems.map((actionItem, index) => {
              return (
                <li key={`archived-action-${index}`}>
                  <div className="archived-action-item">
                    <div className="archived-action-item-task">{actionItem.task}</div>
                    <div className="archived-action-item-bottom">
                      <DateCreated date={actionItem.dateCreated} disabled />
                      <Assignee assignee={actionItem.assignee} readOnly />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <NotFoundSection
          subHeader="No archives were found."
          paragraph={
            <>
              Archives will appear when retros are ended with <span className="bold">completed action items</span>.
            </>
          }
        />
      )}
    </div>
  );
}

export default ActionItemArchives;
