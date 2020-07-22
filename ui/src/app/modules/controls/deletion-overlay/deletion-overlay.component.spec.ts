/*
 *  Copyright (c) 2018 Ford Motor Company
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

import {DeletionOverlayComponent} from './deletion-overlay.component';

describe('DeletionOverlayComponent', () => {
  let component: DeletionOverlayComponent;

  beforeEach(() => {
    component = new DeletionOverlayComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('emitAcceptButtonClicked', () => {

    beforeEach(() => {
      component.acceptButtonClicked = jasmine.createSpyObj({
        emit: null
      });
      component.emitAcceptButtonClicked();
    });

    it('should emit the accept button clicked signal', () => {
      expect(component.acceptButtonClicked.emit).toHaveBeenCalled();
    });
  });

  describe('emitDeclineButtonClicked', () => {

    beforeEach(() => {
      component.declineButtonClicked = jasmine.createSpyObj({
        emit: null
      });
      component.emitDeclineButtonClicked();
    });

    it('should emit the accept button clicked signal', () => {
      expect(component.declineButtonClicked.emit).toHaveBeenCalled();
    });
  });

  describe('emitBlur', () => {

    beforeEach(() => {
      component.blur = jasmine.createSpyObj({
        emit: null
      });
      component.emitBlur();
    });

    it('should emit the accept button clicked signal', () => {
      expect(component.blur.emit).toHaveBeenCalled();
    });
  });
});
