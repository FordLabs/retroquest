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


import {EndRetroDialogComponent} from './end-retro-dialog.component';

describe('EndRetroDialogComponent', () => {
  let component: EndRetroDialogComponent;

  beforeEach(() => {
    component = new EndRetroDialogComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('submit', () => {
    beforeEach(() => {
      component.submitted = jasmine.createSpyObj({
        emit: null
      });
      component.submit();
    });

    it('should emit the submitted signal', () => {
      expect(component.submitted.emit).toHaveBeenCalled();
    });

    it('should hide the dialog', () => {
      expect(component.visible).toBeFalsy();
    });

  });
});
