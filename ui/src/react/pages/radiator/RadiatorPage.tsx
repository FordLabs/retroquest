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

import ActionItemDisplayOnly from '../../components/action-item-display-only/ActionItemDisplayOnly';
import NotFoundSection from '../../components/not-found-section/NotFoundSection';
import ActionItemService from '../../services/api/ActionItemService';
import { ActionItemState } from '../../state/ActionItemState';
import { TeamState } from '../../state/TeamState';

function RadiatorPage(): JSX.Element {
  const team = useRecoilValue(TeamState);
  const [actionItems, setActionItems] = useRecoilState(ActionItemState);

  useEffect(() => {
    if (team.id) {
      ActionItemService.get(team.id, false).then(setActionItems).catch(console.error);
    }
  }, [team.id]);

  return (
    <div className="radiator-page">
      <div className="radiator-subheader" />
      <div className="radiator-page-content">
        {actionItems.length ? (
          <>
            <h1 className="radiator-page-title">Radiator</h1>
            <p className="radiator-page-description">Take a look at all your team's active action items</p>
            <ul className="radiator-page-action-items">
              {actionItems.map((actionItem, index) => {
                return (
                  <li key={`radiator-action-item-${index}`}>
                    <ActionItemDisplayOnly actionItem={actionItem} />
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <NotFoundSection
            subHeader="No active action items were found."
            paragraph={
              <>
                You can create new action items on the <span className="bold">retro page</span>.
              </>
            }
          />
        )}
      </div>
    </div>
  );
}

export default RadiatorPage;
