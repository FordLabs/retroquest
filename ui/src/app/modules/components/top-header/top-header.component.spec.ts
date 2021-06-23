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

import { TopHeaderComponent } from './top-header.component';
import { Router } from '@angular/router';
import { SaveCheckerService } from '../../teams/services/save-checker.service';
import { createMockRouter } from '../../utils/testutils';

describe('TopHeaderComponent', () => {
  let component: TopHeaderComponent;
  let router: Router;
  let saveCheckerService: SaveCheckerService;

  const fakeId = 'fake-id';

  beforeEach(() => {
    router = createMockRouter();

    saveCheckerService = new SaveCheckerService();
    component = new TopHeaderComponent(router, saveCheckerService);
    component.teamId = fakeId;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should change the view to retro if the window url ends with the team id', () => {
      Object.defineProperty(router, 'url', { value: `/url/${fakeId}` });
      component.ngOnInit();
      expect(component.selectedView).toEqual('retro');
    });

    it('should change the view to archives if the window url contains archives string', () => {
      Object.defineProperty(router, 'url', {
        value: `/url/${fakeId}/archives`,
      });
      component.ngOnInit();
      expect(component.selectedView).toEqual('archives');
    });

    it('should change the view to radiator if the window url ends with radiator string', () => {
      Object.defineProperty(router, 'url', {
        value: `/url/${fakeId}/radiator`,
      });
      component.ngOnInit();
      expect(component.selectedView).toEqual('radiator');
    });
  });

  describe('isSelected', () => {
    it('should return true if the passed in view is the one currently selected', () => {
      component.selectedView = 'retro';
      expect(component.isSelected('retro')).toBeTruthy();
    });
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
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        `/team/${fakeId}/archives`
      );
    });
  });
});
