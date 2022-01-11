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

import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { EndRetroDialogComponent } from '../../../components/end-retro-dialog/end-retro-dialog.component';
import { emptyFeedback, Feedback } from '../../../domain/feedback';
import { createMockEventEmitter, createMockHttpClient } from '../../../utils/testutils';
import { FeedbackService } from '../../services/feedback.service';
import { SaveCheckerService } from '../../services/save-checker.service';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let mockFeedbackService: FeedbackService;
  let mockHttpClient: HttpClient;
  const mockSaveCheckerService: SaveCheckerService = null;

  beforeEach(() => {
    mockFeedbackService = {
      addFeedback: jest.fn().mockReturnValue(new Subject()),
    } as unknown as FeedbackService;

    mockHttpClient = createMockHttpClient();

    component = new HeaderComponent(mockFeedbackService, mockSaveCheckerService, mockHttpClient);
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

  describe('showEndRetroDialog', () => {
    it('should show the dialog', () => {
      component.endRetroDialog = {
        show: jest.fn(),
      } as unknown as EndRetroDialogComponent;
      component.showEndRetroDialog();
      expect(component.endRetroDialog.show).toHaveBeenCalled();
    });
  });

  describe('onEndRetroDialogSubmitted', () => {
    it('should emit the end retro signal', () => {
      component.endRetro = createMockEventEmitter();

      component.onEndRetroDialogSubmitted();
      expect(component.endRetro.emit).toHaveBeenCalled();
    });
  });

  describe('onFeedbackSubmitted', () => {
    const fakeFeedback: Feedback = emptyFeedback();

    beforeEach(() => {
      component.teamId = 'I AM A FAKE TEAM ID';
      fakeFeedback.comment = 'I AM A FAKE COMMENT';
      component.onFeedbackSubmitted(fakeFeedback);
    });

    it('should send the feedback to the backend', () => {
      expect(mockFeedbackService.addFeedback).toHaveBeenCalledWith(fakeFeedback);
    });

    it('should send the feedback to the backend', () => {
      expect(fakeFeedback.teamId).toEqual(component.teamId);
    });
  });
});
