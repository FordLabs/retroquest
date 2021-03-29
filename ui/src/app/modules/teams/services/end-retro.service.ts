import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RxStompService } from '@stomp/ng2-stompjs';
import { DataService } from '../../data.service';

@Injectable()
export class EndRetroService {
  constructor(
    private rxStompService: RxStompService,
    private dataService: DataService
  ) {}

  endRetro() {
    this.rxStompService.publish({
      destination: `/app/${this.dataService.team.id}/end-retro`,
      body: JSON.stringify(''),
    });
  }
}
