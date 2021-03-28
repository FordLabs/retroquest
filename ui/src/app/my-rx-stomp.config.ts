import {AuthService} from './modules/auth/auth.service';
import {InjectableRxStompConfig} from '@stomp/ng2-stompjs';

function getBrokerUrl(): string {
  const protocol = location.protocol === 'http:' ? 'ws://' : 'wss://';
  return protocol + location.host + '/websocket/websocket';
}

export const myRxStompConfig: InjectableRxStompConfig = {
  // Which server?
  brokerURL: getBrokerUrl(),

  // Headers
  // Typical keys: login, passcode, host
  connectHeaders: {
    Authorization: AuthService.getToken()
  },

  // How often to heartbeat?
  // Interval in milliseconds, set to 0 to disable
  heartbeatIncoming: 0, // Typical value 0 - disabled
  heartbeatOutgoing: 20000, // Typical value 20000 - every 20 seconds

  // Wait in milliseconds before attempting auto reconnect
  // Set to 0 to disable
  // Typical value 500 (500 milli seconds)
  reconnectDelay: 200,

  // Will log diagnostics on console
  // It can be quite verbose, not recommended in production
  // Skip this key to stop logging to console
  debug: (msg: string): void => {
    console.log(new Date(), msg);
  },
};
