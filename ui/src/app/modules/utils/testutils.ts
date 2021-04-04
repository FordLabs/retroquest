import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs/index';
import 'jest-preset-angular/setup-jest';
import { WebsocketService } from '../teams/services/websocket.service';
import { EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { TeamService } from '../teams/services/team.service';
import { RenderResult } from '@testing-library/angular/src/lib/models';
import userEvent from '@testing-library/user-event';

export function createMockHttpClient(): HttpClient {
  // @ts-ignore
  return {
    request: jest.fn().mockReturnValue(new Observable()),
    delete: jest.fn().mockReturnValue(new Observable()),
    get: jest.fn().mockReturnValue(new Observable()),
    put: jest.fn().mockReturnValue(new Observable()),
    head: jest.fn().mockReturnValue(new Observable()),
    options: jest.fn().mockReturnValue(new Observable()),
    patch: jest.fn().mockReturnValue(new Observable()),
    post: jest.fn().mockReturnValue(new Observable()),
  } as HttpClient;
}

export function createMockWebSocketService(): WebsocketService {
  // @ts-ignore
  return {
    getWebsocketState: jest.fn(),
    closeWebsocket: jest.fn(),
    openWebsocket: jest.fn(),
    sendHeartbeat: jest.fn(),
    heartbeatTopic: jest.fn(),
    endRetroTopic: jest.fn(),
    thoughtsTopic: jest.fn(),
    createThought: jest.fn(),
    deleteThought: jest.fn(),
    updateThought: jest.fn(),
    actionItemTopic: jest.fn(),
    columnTitleTopic: jest.fn(),
    createActionItem: jest.fn(),
    updateActionItem: jest.fn(),
    deleteActionItem: jest.fn(),
    updateColumnTitle: jest.fn(),
    deleteAllThoughts: jest.fn(),
    endRetro: jest.fn(),
  } as WebsocketService;
}

export function createMockEventEmitter(): EventEmitter<any> {
  // @ts-ignore
  return {
    emit: jest.fn(),
    subscribe: jest.fn(),
  } as EventEmitter<any>;
}

export function createMockRouter(): Router {
  // @ts-ignore
  return {
    navigate: jest.fn(),
    navigateByUrl: jest.fn(),
  } as Router;
}

export function createMockRecaptchaComponent() {
  return {
    reset: jest.fn(),
    execute: jest.fn(),
  };
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

  return ({
    isCaptchaEnabled: jest.fn().mockReturnValue(of(captchResponse)),
    isCaptchaEnabledForTeam: jest.fn().mockReturnValue(of(captchResponse)),
    create: jest.fn().mockReturnValue(of(createTeamResponse)),
  } as unknown) as TeamService;
}

export function enterTextIntoFormElement(
  component: RenderResult<any>,
  labelByText: string,
  formValue: string
): void {
  const input = component.getByLabelText(labelByText);
  userEvent.type(input, formValue);
}
