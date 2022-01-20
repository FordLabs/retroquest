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

import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { RxStompService } from '@stomp/ng2-stompjs';
import { Client, IMessage } from '@stomp/stompjs';
import { RenderResult } from '@testing-library/angular/src/lib/models';
import userEvent from '@testing-library/user-event';
import { Observable, of, Subscription } from 'rxjs';

import 'jest-preset-angular/setup-jest';

import { TeamService } from '../teams/services/team.service';

export function createMockHttpClient(): HttpClient {
  return {
    request: jest.fn().mockReturnValue(new Observable()),
    delete: jest.fn().mockReturnValue(new Observable()),
    get: jest.fn().mockReturnValue(new Observable()),
    put: jest.fn().mockReturnValue(new Observable()),
    head: jest.fn().mockReturnValue(new Observable()),
    options: jest.fn().mockReturnValue(new Observable()),
    patch: jest.fn().mockReturnValue(new Observable()),
    post: jest.fn().mockReturnValue(new Observable()),
  } as unknown as HttpClient;
}

export function createMockRxStompService(): RxStompService {
  const fakeWatch = {
    subscribe: jest.fn(),
  } as unknown as Observable<IMessage>;

  const fakeStompClient = {
    connectHeaders: '',
    forceDisconnect: jest.fn(),
  } as unknown as Client;

  return {
    publish: jest.fn(),
    watch: jest.fn().mockReturnValue(fakeWatch),
    stompClient: fakeStompClient,
  } as unknown as RxStompService;
}

export function createMockEventEmitter(): EventEmitter<any> {
  return {
    emit: jest.fn(),
    subscribe: jest.fn(),
  } as unknown as EventEmitter<any>;
}

export function createMockRouter(): Router {
  return {
    navigate: jest.fn(),
    navigateByUrl: jest.fn(),
  } as unknown as Router;
}

export function createMockRecaptchaComponent() {
  return {
    reset: jest.fn(),
    execute: jest.fn(),
  };
}

export function createMockSubscription(): Subscription {
  return {
    unsubscribe: jest.fn(),
  } as unknown as Subscription;
}

export function createMockTeamService(): TeamService {
  const captchResponse = {
    status: 200,
    body: '{"captchaEnabled":false}',
  };

  const createTeamResponse: HttpResponse<string> = new HttpResponse({
    body: 'im.a.jwt',
    headers: new HttpHeaders({ location: 'team/teamId' }),
  });

  return {
    isCaptchaEnabled: jest.fn().mockReturnValue(of(captchResponse)),
    isCaptchaEnabledForTeam: jest.fn().mockReturnValue(of(captchResponse)),
    create: jest.fn().mockReturnValue(of(createTeamResponse)),
  } as unknown as TeamService;
}

export function enterTextIntoFormElement(component: RenderResult<any>, labelByText: string, formValue: string): void {
  const input = component.getByLabelText(labelByText);
  userEvent.type(input, formValue);
}
