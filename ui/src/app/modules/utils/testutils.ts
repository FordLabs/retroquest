import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/index';
import 'jest-preset-angular/setup-jest';
import { EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { RxStompService } from '@stomp/ng2-stompjs';
import { IMessage } from '@stomp/stompjs';
import { ColumnAggregationService } from '../teams/services/column-aggregation.service';
import { Subscription } from 'rxjs';

export function createMockHttpClient(): HttpClient {
  return ({
    request: jest.fn().mockReturnValue(new Observable()),
    delete: jest.fn().mockReturnValue(new Observable()),
    get: jest.fn().mockReturnValue(new Observable()),
    put: jest.fn().mockReturnValue(new Observable()),
    head: jest.fn().mockReturnValue(new Observable()),
    options: jest.fn().mockReturnValue(new Observable()),
    patch: jest.fn().mockReturnValue(new Observable()),
    post: jest.fn().mockReturnValue(new Observable()),
  } as unknown) as HttpClient;
}

export function createMockRxStompService(): RxStompService {
  const fakeWatch = ({
    subscribe: jest.fn(),
  } as unknown) as Observable<IMessage>;

  return ({
    publish: jest.fn(),
    watch: jest.fn().mockReturnValue(fakeWatch),
  } as unknown) as RxStompService;
}

export function createMockEventEmitter(): EventEmitter<any> {
  return ({
    emit: jest.fn(),
    subscribe: jest.fn(),
  } as unknown) as EventEmitter<any>;
}

export function createMockRouter(): Router {
  return ({
    navigate: jest.fn(),
    navigateByUrl: jest.fn(),
  } as unknown) as Router;
}

export function createMockRecaptchaComponent() {
  return {
    reset: jest.fn(),
    execute: jest.fn(),
  };
}

export function createMockColumnAggregationService(): ColumnAggregationService {
  const observable = ({
    subscribe: jest.fn(),
  } as unknown) as Observable<any>;

  return ({
    getColumns: jest.fn().mockReturnValue(observable),
  } as unknown) as ColumnAggregationService;
}

export function createMockSubscription(): Subscription {
  return ({
    unsubscribe: jest.fn(),
  } as unknown) as Subscription;
}
