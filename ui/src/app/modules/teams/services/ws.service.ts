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

  private validTeamId(teamId: string) {
    return this.dataService.team.id === teamId;
  }

  createThought(thought: Thought) {
    if (this.validTeamId(thought.teamId)) {
      this.rxStompService.publish({destination: `/app/${this.dataService.team.id}/thought/create`, body: JSON.stringify(thought)});
    }
  }

  deleteThought(thought: Thought) {
    if (this.validTeamId(thought.teamId)) {
      this.rxStompService.publish({destination: `/app/${this.dataService.team.id}/thought/delete`, body: JSON.stringify(thought)});
    }
  }

  updateThought(thought: Thought) {
    if (this.validTeamId(thought.teamId)) {
      this.rxStompService.publish({destination: `/app/${this.dataService.team.id}/thought/edit`, body: JSON.stringify(thought)});
    }
  }
}
