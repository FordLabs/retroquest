import {WebsocketService} from './websocket.service';
import {WsService} from './ws.service';
import {RxStompService} from '@stomp/ng2-stompjs';
import {DataService} from '../../data.service';

describe('WebsocketService', () => {

  let service: WsService;
  let spiedStompService: RxStompService;
  const dataService: DataService = new DataService();
  const teamId = 'teamId';

  beforeEach(() => {
    // @ts-ignore
    spiedStompService = {
      publish: jest.fn(),
    } as RxStompService;

    dataService.team.id = teamId;

    service = new WsService(spiedStompService, dataService);
  });

  function createTestThought(id: string) {
    return {
      'id': null,
      'teamId': id,
      'topic': 'confused',
      'message': 'asd',
      'hearts': 0,
      'discussed': false,
      'columnTitle': {'id': 2, 'topic': 'confused', 'title': 'Confused', 'teamId': 'test'}
    };
  }


  describe('createThought', () => {

    it('should send a message', () => {
      const testThought = createTestThought(teamId);

      service.createThought(testThought);

      expect(spiedStompService.publish).toHaveBeenCalledWith(
        {destination: `/app/${testThought.teamId}/thought/create`, body: JSON.stringify(testThought)}
      );
    });

    it('does not allow messages to be sent for other teams', () => {
      const testThought = createTestThought('hacker');

      service.createThought(testThought);

      expect(spiedStompService.publish).not.toHaveBeenCalled();
    });

  });

});

