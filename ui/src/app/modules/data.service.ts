import {Themes} from "./domain/Theme";
import {EventEmitter} from "@angular/core";

export class DataService {

  team = {
    id: '',
    name: '',
  };

  themeChanged: EventEmitter<Themes> = new EventEmitter();
}
