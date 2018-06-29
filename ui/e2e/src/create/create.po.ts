import { browser, by, element, ElementFinder } from 'protractor';

export class CreatePage {
  createRandomBoard(boardName: string = '', password: string = 'password'): Promise<string> {
    const randomBoardName = boardName + new Date().getTime();
    return this.createBoard(randomBoardName, password);
  }

  createBoard(boardName: string, password: string = 'password'): Promise<string> {
    return new Promise<string>((resolve) => {
      this.teamNameInput().sendKeys(boardName).then(() => {
        this.teamPasswordInput().sendKeys(password).then(() => {
          this.teamPasswordConfirm().sendKeys(password).then(() => {
            browser.sleep(1); // make sure timestamps are at least 1 mili apart
            this.createRetroButton().click().then(() => {
              browser.getCurrentUrl().then((url: string) => {
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

  loginBoardLink(): ElementFinder {
    return element(by.tagName('a'));
  }

  errorMessage(): ElementFinder {
    return element(by.css('#errorMessage'));
  }
}
