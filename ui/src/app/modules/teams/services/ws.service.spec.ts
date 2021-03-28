import {WebsocketService} from './websocket.service';
import {WsService} from './ws.service';
import {RxStompService} from '@stomp/ng2-stompjs';
import {DataService} from '../../data.service';

describe('WsService', () => {

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

  function createTestThought(team: string, id: number = null) {
    return {
      'id': id,
      'teamId': team,
      'topic': 'confused',
      'message': 'asd',
      'hearts': 0,
      'discussed': false,
      'columnTitle': {'id': 2, 'topic': 'confused', 'title': 'Confused', 'teamId': 'test'}
    };
  }


  describe('Thoughts', () => {
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

    describe('updateThought', () => {
      it('should send a message', () => {
        const testThought = createTestThought(teamId, 1);

        service.updateThought(testThought);

        expect(spiedStompService.publish).toHaveBeenCalledWith(
          {destination: `/app/${testThought.teamId}/thought/edit`, body: JSON.stringify(testThought)}
        );
      });

      it('does not allow messages to be updated for other teams', () => {
        const testThought = createTestThought('hacker', 1);

        service.updateThought(testThought);

        expect(spiedStompService.publish).not.toHaveBeenCalled();
      });
    });

    describe('deleteThought', () => {
      it('should send a message', () => {

        const testThought = createTestThought(teamId, 1);
        service.deleteThought(testThought);

        expect(spiedStompService.publish).toHaveBeenCalledWith(
          {destination: `/app/${testThought.teamId}/thought/delete`, body: JSON.stringify(testThought)}
        );
      });

      it('does not allow messages to be deleted for other teams', () => {
        const testThought = createTestThought('hacker', 1);

        service.deleteThought(testThought);

        expect(spiedStompService.publish).not.toHaveBeenCalled();
      });

    });

  });


});

