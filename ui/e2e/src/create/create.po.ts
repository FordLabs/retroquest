import { browser, by, element, ElementFinder } from 'protractor';

export class CreatePage {
  navigateTo() {
    return browser.get('/create');
  }

  teamNameInput(): ElementFinder {
    return element(by.css('#teamNameInput'));
  }

  teamPasswordInput(): ElementFinder {
    return element(by.css('#teamPasswordInput'));
  }

  teamPasswordConfirm(): ElementFinder {
    return element(by.css('#teamPasswordConfirmInput'));
  }

  createRetroButton(): ElementFinder {
    return element(by.css('#createRetroButton'));
  }

  errorMessage(): ElementFinder {
    return element(by.css('#errorMessage'));
  }
}


