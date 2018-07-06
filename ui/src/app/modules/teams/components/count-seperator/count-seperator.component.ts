import {Component, Input} from '@angular/core';

@Component({
  selector: 'rq-count-seperator',
  templateUrl: './count-seperator.component.html',
  styleUrls: ['./count-seperator.component.scss']
})
export class CountSeperatorComponent {

  @Input() count: number;

  constructor() { }

}
