import {browser, by, element, ElementFinder} from 'protractor';
import {CreatePage} from '../create/create.po';

export class LoginPage {

  private createPage = new CreatePage();

  createBoard(boardName: string) {
    return new Promise<string>((resolve) => {
      this.createPage.navigateTo().then(() => {
        this.createPage.createBoard(boardName).then(() => {
          this.navigateTo().then(() => {
            resolve(boardName);
          });
        });
      });
    });
  }

  createRandomBoard(boardName: string = '') {
    return this.createBoard(boardName + new Date().getTime());
  }

  navigateTo() {
    return browser.get('/login');
  }

  teamNameInput(): ElementFinder {
    return element(by.id('teamNameInput'));
  }

  teamPasswordInput(): ElementFinder {
    return element(by.id('teamPasswordInput'));
  }

  signInButton(): ElementFinder {
    return element(by.id('signInButton'));
  }

  createBoardLink(): ElementFinder {
    return element(by.id('createBoard'));
  }

  errorMessage(): ElementFinder {
    return element(by.id('errorMessage'));
  }
}
