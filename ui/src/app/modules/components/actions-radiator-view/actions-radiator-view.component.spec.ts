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

import { ActionsRadiatorViewComponent } from './actions-radiator-view.component';
import { ActionItemService } from '../../teams/services/action.service';
import { of } from 'rxjs';
import { DataService } from '../../data.service';
import { EventEmitter } from '@angular/core';

describe('ActionsRadiatorViewComponent', () => {
  let component: ActionsRadiatorViewComponent;
  let mockActionItemService: ActionItemService;
  let dataService: DataService;

  beforeEach(() => {
    // @ts-ignore
    mockActionItemService = {
      fetchActionItems: jest.fn().mockReturnValue(of([])),
    } as ActionItemService;

    dataService = new DataService();

    component = new ActionsRadiatorViewComponent(
      mockActionItemService,
      dataService
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('show', () => {
    beforeEach(() => {
      component.show();
    });

    it('should display the dialog when called', () => {
      expect(component.visible).toBeTruthy();
    });

    it('should set a function callback to document.onkeydown', () => {
      expect(document.onkeydown).not.toBeNull();
    });
  });

  describe('hide', () => {
    beforeEach(() => {
      // @ts-ignore
      component.visibilityChanged = {
        emit: jest.fn(),
      } as EventEmitter<boolean>;

      component.hide();
    });

    it('should set the visibility to false', () => {
      expect(component.visible).toBeFalsy();
    });

    it('should emit the visibility changed signal', () => {
      expect(component.visibilityChanged.emit).toHaveBeenCalled();
    });

    it('should set the document.onkeydown callback to null', () => {
      expect(document.onkeydown).toBeNull();
    });
  });
});
