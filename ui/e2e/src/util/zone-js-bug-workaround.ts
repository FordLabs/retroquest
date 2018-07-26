/*
* This is a workaround for bug https://github.com/angular/angular/issues/20921.
* A fix has been merged into zone.js as of June 18, 2018 however a new version
* of zone.js has not been released. Once released, update zone.js, remove
* references to this file and delete it.
* */

import {browser} from 'protractor';

export class ZoneJsBugWorkaround {
  static wait() {
    browser.driver.sleep(750);
  }
}
