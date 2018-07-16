import { browser, by, element, ElementFinder } from 'protractor';

export class CreatePage {
  createRandomBoard(boardName: string = '', password: string = 'Passw0rd'): Promise<string> {
    const randomBoardName = boardName + new Date().getTime();
    return this.createBoard(randomBoardName, password);
  }

  createBoard(boardName: string, password: string = 'Passw0rd'): Promise<string> {
    return new Promise<string>((resolve) => {
      this.teamNameInput().sendKeys(boardName).then(() => {
        this.teamPasswordInput().sendKeys(password).then(() => {
          this.teamPasswordConfirm().sendKeys(password).then(() => {
            browser.sleep(1); // make sure timestamps are at least 1 mili apart
            this.createRetroButton().click().then(() => {
              browser.driver.getCurrentUrl().then((url: string) => {
                const boardId = boardName.replace(' ', '-');
                if (url.endsWith(`/team/${boardId}`)) {
                  resolve(boardId);
                } else {
                  resolve('failed to navigate to team page');
                }
              });
            });
          });
        });
      });
    });
  }

  navigateTo() {
    return browser.get('/create');
  }

  teamNameInput(): ElementFinder {
    return element(by.id('teamNameInput'));
  }

  teamPasswordInput(): ElementFinder {
    return element(by.id('teamPasswordInput'));
  }

  teamPasswordConfirm(): ElementFinder {
    return element(by.id('teamPasswordConfirmInput'));
  }

  createRetroButton(): ElementFinder {
    return element(by.id('createRetroButton'));
  }

  loginBoardLink(): ElementFinder {
    return element(by.id('loginBoard'));
  }

  errorMessage(): ElementFinder {
    return element(by.id('errorMessage'));
  }
}
