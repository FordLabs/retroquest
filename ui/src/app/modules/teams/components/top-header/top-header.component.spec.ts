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

import {TopHeaderComponent} from './top-header.component';
import {Router} from '@angular/router';

describe('TopHeaderComponent', () => {
  let component: TopHeaderComponent;
  let router: Router;

  const fakeId = 'fake-id';

  beforeEach(() => {
    router = jasmine.createSpyObj({navigateByUrl: null});
    component = new TopHeaderComponent(router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('changeView', () => {

    beforeEach(() => {
      component.teamId = fakeId;
    });

    it('should change the selected view to the one passed in', () => {
      component.selectedView = 'hello';
      component.changeView('world');
      expect(component.selectedView).toEqual('world');
    });

    it('should navigate to the retro board', () => {
      component.changeView('retro');
      expect(router.navigateByUrl).toHaveBeenCalledWith(`/team/${fakeId}`);
    });

    it('should navigate to the archives board', () => {
      component.changeView('archives');
      expect(router.navigateByUrl).toHaveBeenCalledWith(`/team/${fakeId}/archives`);
    });

  });
});
