import { CreatePage } from './create.po';
import { browser } from 'protractor';

describe('Create Page', () => {
  let page: CreatePage;

  beforeEach(() => {
    page = new CreatePage();
    page.navigateTo();
  });

  it('should be able to navigate to /create', () => {
    expect(browser.getCurrentUrl()).toContain('create');
  });

  describe('failing to create team', () => {
    it('should display error message if no board name input', () => {
      page.createRetroButton().click().then(() => {
        page.errorMessage().getText().then((errorMessageText) => {
          expect(errorMessageText).toBe('Please enter a team name');
        });
      });
    });

    it('should display error message if there is no password', () => {
      page.teamNameInput().sendKeys('team name').then(() => {
        page.createRetroButton().click().then(() => {
          page.errorMessage().getText().then((errorMessageText) => {
            expect(errorMessageText).toBe('Please enter a password');
          });
        });
      });
    });

    it('should display error message if passwords do not match', () => {
      page.teamNameInput().sendKeys('team name').then(() => {
        page.teamPasswordInput().sendKeys('password').then(() => {
          page.createRetroButton().click().then(() => {
            page.errorMessage().getText().then((errorMessageText) => {
              expect(errorMessageText).toBe('Please enter matching passwords');
            });
          });
        });
      });
    });

    it('should display error message if passwords are not 8 chars', () => {
      page.teamNameInput().sendKeys('team name').then(() => {
        page.teamPasswordInput().sendKeys('passwrd').then(() => {
          page.teamPasswordConfirm().sendKeys('passwrd').then(() => {
            page.createRetroButton().click().then(() => {
              page.errorMessage().getText().then((errorMessageText) => {
                expect(errorMessageText).toBe('Password must be 8 characters or longer.');
              });
            });
          });
        });
      });
    });

    it('should create a board and navigate to that boards team page', () => {
      page.createRandomBoard('team name').then((boardId) => {
        browser.getCurrentUrl().then((url: string) => {
          expect(url).toContain(`/team/${boardId}`);
        });
      });
    });

    it('should display error message if board name is already taken', () => {
      page.createBoard('team name').then(() => {
        page.createBoard('team name').then(() => {
          page.errorMessage().getText().then((errorMessageText) => {
            expect(errorMessageText).toBe('This board name is already in use. Please try another one.');
          });
        });
      });
    });
  });
});
