import {LoginPage} from './login.po';
import {browser} from 'protractor';
import {ZoneJsBugWorkaround as workaround} from '../util/zone-js-bug-workaround';

describe('Login Page', () => {
  let page: LoginPage;
  const validPassword = 'Passw0rd';
  const invalidPassword = 'passwrd';

  beforeEach(() => {
    page = new LoginPage();
    page.navigateTo();
  });

  it('should be able to navigate to /login', () => {
    browser.getCurrentUrl().then((url: string) => {
      expect(url).toContain('/login');
    });
  });

  it('should be able to navigate to /create from link', () => {
    page.createBoardLink().click().then(() => {
      expect(browser.getCurrentUrl()).toContain('/create');
    });
  });

  describe('failing to login', () => {
    it('should display error message if no board name input', () => {
      page.signInButton().click().then(() => {
        expect(page.errorMessage().getText()).toBe('Please enter a team name');
      });
    });

    it('should display error message if there is no password', () => {
      page.teamNameInput().sendKeys('team name').then(() => {
        page.signInButton().click().then(() => {
          expect(page.errorMessage().getText()).toBe('Please enter a password');
        });
      });
    });

    it('should display error message if password is incorrect', () => {
      page.teamNameInput().sendKeys('team name').then(() => {
        page.teamPasswordInput().sendKeys(invalidPassword).then(() => {
          page.signInButton().click().then(() => {
            workaround.wait();
            expect(page.errorMessage().getText()).toBe('Incorrect board or password. Please try again.');
          });
        });
      });
    });

    it('should display error message if board name does not exist', () => {
      page.teamNameInput().sendKeys('team name that does not exist').then(() => {
        page.teamPasswordInput().sendKeys(validPassword).then(() => {
          page.signInButton().click().then(() => {
            workaround.wait();
            expect(page.errorMessage().getText()).toBe('Incorrect board name. Please try again.');
          });
        });
      });
    });
  });

  describe('successfully signing into a team board', () => {
    it('should create a board and navigate to that boards team page', () => {
      page.createRandomBoard().then((boardName) => {
        page.teamNameInput().sendKeys(boardName).then(() => {
          page.teamPasswordInput().sendKeys(validPassword).then(() => {
            page.signInButton().click().then(() => {
              workaround.wait();
              expect(browser.driver.getCurrentUrl()).toContain(`/team/${boardName}`);
            });
          });
        });
      });
    });
  });
});
