import {Component, Input} from '@angular/core';
import {Themes} from '../../domain/Theme';

@Component({
  selector: 'rq-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
  host: {
    '[class.dark-theme]': 'darkThemeIsEnabled'
  }
})
export class TooltipComponent {

  @Input() text = '';
  @Input() theme = Themes.Light;

  get darkThemeIsEnabled(): boolean {
    return this.theme === Themes.Dark;
  }

}
