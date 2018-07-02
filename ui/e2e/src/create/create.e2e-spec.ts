import { CreatePage } from './create.po';
import { browser } from 'protractor';

describe('Create Page', () => {
  let page: CreatePage;

  beforeEach(() => {
    page = new CreatePage();
    page.navigateTo();
  });

  it('should be able to navigate to /create', () => {
    expect(browser.getCurrentUrl()).toContain('/create');
  });

  it('should be able to navigate to /login from link', () => {
    page.loginBoardLink().click().then(() => {
      expect(browser.getCurrentUrl()).toContain('/login');
    });
  });

  describe('failing to create team', () => {
    it('should display error message if no board name input', () => {
      page.createRetroButton().click().then(() => {
        expect(page.errorMessage().getText()).toBe('Please enter a team name');
      });
    });

    it('should display error message if there is no password', () => {
      page.teamNameInput().sendKeys('team name').then(() => {
        page.createRetroButton().click().then(() => {
          expect(page.errorMessage().getText()).toBe('Please enter a password');
        });
      });
    });

    it('should display error message if passwords do not match', () => {
      page.teamNameInput().sendKeys('team name').then(() => {
        page.teamPasswordInput().sendKeys('password').then(() => {
          page.createRetroButton().click().then(() => {
            expect(page.errorMessage().getText()).toBe('Please enter matching passwords');
          });
        });
      });
    });

    it('should display error message if passwords are not 8 chars', () => {
      page.teamNameInput().sendKeys('team name').then(() => {
        page.teamPasswordInput().sendKeys('passwrd').then(() => {
          page.teamPasswordConfirm().sendKeys('passwrd').then(() => {
            page.createRetroButton().click().then(() => {
              expect(page.errorMessage().getText()).toBe('Password must be 8 characters or longer.');
            });
          });
        });
      });
    });

    it('should display error message if board name is already taken', () => {
      page.createBoard('team name').then(() => {
        page.navigateTo().then(() => {
          page.createBoard('team name').then(() => {
            expect(page.errorMessage().getText()).toBe('This board name is already in use. Please try another one.');
          });
        });
      });
    });

    it('should display error message if board name contains special characters', () => {
      page.createBoard('team-name').then(() => {
        expect(page.errorMessage().getText()).toBe('Please enter a board name without any special characters.');
      });
    });
  });

  describe('successfuly creating a team board', () => {
    it('should create a board and navigate to that boards team page', () => {
      page.createRandomBoard('team name').then((boardId) => {
        expect(browser.driver.getCurrentUrl()).toContain(`/team/${boardId}`);
      });
    });
  });
});
