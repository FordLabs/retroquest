/*
 *  Copyright (c) 2020 Ford Motor Company
 *  All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */


import {EndRetroDialogComponent} from './end-retro-dialog.component';
import {createMockEventEmitter} from '../../utils/testutils';

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
      component.submitted = createMockEventEmitter();
      component.submit();
    });

    it('should emit the submitted signal', () => {
      expect(component.submitted.emit).toHaveBeenCalled();
    });

    it('should hide the dialog', () => {
      expect(component.visible).toBeFalsy();
    });

    it('should set the document.onkeydown callback to null', () => {
      expect(document.onkeydown).toBeNull();
    });

  });

  describe('show', () => {

    beforeEach(() => {
      component.show();
    });

    it('should set a function callback to document.onkeydown', () => {
      expect(document.onkeydown).not.toBeNull();
    });
  });
});
