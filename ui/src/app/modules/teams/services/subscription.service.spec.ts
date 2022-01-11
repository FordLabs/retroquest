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

import { EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { mock } from 'ts-mockito';

import { DataService } from '../../data.service';
import { Column } from '../../domain/column';
import { WebsocketActionItemResponse, WebsocketThoughtResponse } from '../../domain/websocket-response';
import { createMockRxStompService, createMockSubscription } from '../../utils/testutils';

import { SaveCheckerService } from './save-checker.service';
import { SubscriptionService } from './subscription.service';

describe('destroying service', () => {
  const dataService = new DataService();
  dataService.team = {
    id: 'team-id',
    name: 'testing team',
  };

  const saveCheckerService = mock(SaveCheckerService);

  describe('closing subscription', () => {
    let service: SubscriptionService;
    beforeEach(() => {
      service = new SubscriptionService(dataService, saveCheckerService, createMockRxStompService());
      service.thoughtSubscription = createMockSubscription();
      service.actionItemSubscription = createMockSubscription();
      service.columnTitleSubscription = createMockSubscription();
      service.endRetroSubscription = createMockSubscription();
    });

    describe('Subscriptions initialized', () => {
      function performTest(subscriptionToSpy: Subscription) {
        const spy = jest.spyOn(subscriptionToSpy, 'unsubscribe');
        service.ngOnDestroy();
        expect(spy).toHaveBeenCalled();
      }

      it(`closes thought subscription if not null`, () => {
        performTest(service.thoughtSubscription);
      });

      it(`closes action item subscription if not null`, () => {
        performTest(service.actionItemSubscription);
      });

      it(`closes column title subscription if not null`, () => {
        performTest(service.columnTitleSubscription);
      });

      it(`closes end retro subscription if not null`, () => {
        performTest(service.endRetroSubscription);
      });
    });

    describe('subscriptions not initialized', () => {
      it('does not try to close thought subscription if null', () => {
        service.thoughtSubscription = null;
        service.ngOnDestroy();
        //exception thrown if it tries to call unsubscribe
      });

      it('does not try to close action item subscription if null', () => {
        service.actionItemSubscription = null;
        service.ngOnDestroy();
      });

      it('does not try to close column title subscription if null', () => {
        service.columnTitleSubscription = null;
        service.ngOnDestroy();
      });

      it('does not try to close end retro subscription if null', () => {
        service.endRetroSubscription = null;
        service.ngOnDestroy();
      });
    });
  });

  describe('initializing subscription', () => {
    let service: SubscriptionService;
    const spiedStompService = createMockRxStompService();

    beforeEach(() => {
      service = new SubscriptionService(dataService, saveCheckerService, spiedStompService);
    });

    it('Subscribes to thought subscription', () => {
      service.subscribeToThoughts(new EventEmitter<WebsocketThoughtResponse>());
      expect(spiedStompService.watch).toHaveBeenCalledWith(`/topic/${dataService.team.id}/thoughts`);
    });

    it('Subscribes to action item subscription', () => {
      service.subscribeToActionItems(new EventEmitter<WebsocketActionItemResponse>());
      expect(spiedStompService.watch).toHaveBeenCalledWith(`/topic/${dataService.team.id}/action-items`);
    });

    it('Subscribes to column titles subscription', () => {
      service.subscribeToColumnTitles(new EventEmitter<Column>());
      expect(spiedStompService.watch).toHaveBeenCalledWith(`/topic/${dataService.team.id}/column-titles`);
    });

    it('Subscribes to action item subscription', () => {
      service.subscribeToEndRetro(new EventEmitter<void>());
      expect(spiedStompService.watch).toHaveBeenCalledWith(`/topic/${dataService.team.id}/end-retro`);
    });
  });
});
