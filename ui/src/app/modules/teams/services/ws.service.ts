import {Injectable} from '@angular/core';
import {RxStompService} from '@stomp/ng2-stompjs';
import {Thought} from '../../domain/thought';
import {DataService} from '../../data.service';

@Injectable()
export class WsService {

  static instantiationCount = 0;

  constructor(private rxStompService: RxStompService, private dataService: DataService) {
    WsService.instantiationCount++;
    console.log(`\tWsService instantiation count=${WsService.instantiationCount}`);
  }

  createThought(thought: Thought) {
    if (this.validTeamId(thought.teamId)) {
      this.rxStompService.publish({destination: `/app/${thought.teamId}/thought/create`, body: JSON.stringify(thought)});
    }
  }

  private validTeamId(teamId: string) {
    return this.dataService.team.id === teamId;
  }

  deleteThought(thought: Thought) {

  }

  updateThought(thought: Thought) {

  }

  deleteAllThoughts() {

  }
}
