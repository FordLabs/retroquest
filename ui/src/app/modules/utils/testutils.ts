import {HttpClient} from '@angular/common/http';
import {Observable, Subscription} from 'rxjs/index';
import 'jest-preset-angular/setup-jest';
import {WebsocketService} from '../teams/services/websocket.service';
import {EventEmitter} from '@angular/core';

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
    subscribe: jest.fn()
  } as EventEmitter<any>;
}
