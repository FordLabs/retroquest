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

import { FeedbackDialogComponent } from './feedback-dialog.component';
import { createMockEventEmitter } from '../../utils/testutils';

describe('DialogComponent', () => {
  let component: FeedbackDialogComponent;

  beforeEach(() => {
    component = new FeedbackDialogComponent();
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
      component.visibilityChanged = createMockEventEmitter();
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

  describe('onStarClicked', () => {
    beforeEach(() => {
      component.starsClicked = true;
      component.starStates.fill(true);
      component.onStarClicked(0);
    });

    it('should set the stars clicked flag to true', () => {
      expect(component.starsClicked).toBeTruthy();
    });

    it('should not modify the star states', () => {
      expect(component.starStates).toContain(true);
    });
  });

  describe('clearStars', () => {
    beforeEach(() => {
      component.starStates.fill(true);
    });

    it('should set the star states to false', () => {
      component.starsClicked = false;
      component.clearStars();
      expect(component.starStates).not.toContain(true);
    });

    it('should not modify the star states', () => {
      component.starsClicked = true;
      component.clearStars();
      expect(component.starStates).toContain(true);
    });
  });

  describe('onStarHovered', () => {
    beforeEach(() => {
      component.starStates.fill(false);
    });

    it('should set all of the star states to true if the stars havent been clicked', () => {
      component.starsClicked = false;
      component.onStarHovered(component.starStates.length);
      expect(component.starStates).not.toContain(false);
    });

    it('should set all of the star states up to the length passed in, if the stars havent been clicked', () => {
      component.starsClicked = false;
      component.onStarHovered(2);
      expect(component.starStates).toEqual([true, true, true, false, false]);
    });

    it(
      'should set the star count of the feedback message to the passed in value plus 1' +
        ', if the stars havent been clicked',
      () => {
        component.starsClicked = false;
        component.onStarHovered(3);
        expect(component.feedback.stars).toEqual(4);
      }
    );

    it('should not set the star states', () => {
      component.starStates.fill(true);
      component.starsClicked = true;
      component.onStarHovered(component.starStates.length);
      expect(component.starStates).toContain(true);
    });
  });

  describe('onSendButtonClicked', () => {
    beforeEach(() => {
      component.visible = true;
      component.submitted = createMockEventEmitter();
    });

    describe('comments are filled in', () => {
      beforeEach(() => {
        component.feedback.comment = 'great job retroquest!';
        component.onSendButtonClicked();
      });

      it('should emit the submitted signal', () => {
        expect(component.submitted.emit).toHaveBeenCalled();
      });

      it('should hide the dialog', () => {
        expect(component.visible).toBeFalsy();
      });
    });

    describe('comments are not filled in', () => {
      beforeEach(() => {
        component.feedback.comment = '';
        component.onSendButtonClicked();
      });

      it('should not emit the submitted signal', () => {
        expect(component.submitted.emit).not.toHaveBeenCalled();
      });

      it('should keep the dialog visible', () => {
        expect(component.visible).toBeTruthy();
      });
    });
  });
});
