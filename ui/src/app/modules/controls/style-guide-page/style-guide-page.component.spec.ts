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

import {StyleGuidePageComponent} from './style-guide-page.component';

describe('StyleGuidePageComponent', () => {
  let component: StyleGuidePageComponent;

  beforeEach(() => {
    component = new StyleGuidePageComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('scrollToId', () => {

    it('should be able to scroll to any page id if it exists on the page', () => {
      const fakeFoundElement = jasmine.createSpyObj( {
        scrollIntoView: null
      });
      const spyQuerySelector = spyOn(document, 'querySelector').and.returnValue(fakeFoundElement);
      const fakeId = 'FAKE ID';

      component.scrollToId(fakeId);

      expect(spyQuerySelector).toHaveBeenCalledWith('#' + fakeId);
      expect(fakeFoundElement.scrollIntoView).toHaveBeenCalled();
    });

    it('should not be able to scroll to page id if it doesnt exist on the page', () => {
      const elementNotFound = null;
      const spyQuerySelector = spyOn(document, 'querySelector').and.returnValue(elementNotFound);
      const fakeId = 'FAKE ID';

      component.scrollToId(fakeId);

      expect(spyQuerySelector).toHaveBeenCalledWith('#' + fakeId);
      expect(elementNotFound).toBeNull();
    });

  });

  describe('showDialog', () => {
    it('should display the dialog when called', () => {
      component.showDialog();
      expect(component.dialogIsVisible).toBeTruthy();
    });
  });

});
