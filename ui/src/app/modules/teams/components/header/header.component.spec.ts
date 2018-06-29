/*
 * Copyright (c) 2018 Ford Motor Company
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

import {HeaderComponent} from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;

  beforeEach(() => {
    component = new HeaderComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getCsvUrl', () => {
    it('should return the cvs api url', () => {
      const teamId = 'team-id';

      component.teamId = teamId;

      expect(component.getCsvUrl()).toEqual(`api/team/${teamId}/csv`);
    });

  });
});
