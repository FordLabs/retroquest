import { CreatePage } from './create.po';
import { browser } from 'protractor';

describe('Create Page', () => {
  let page: CreatePage;

  beforeEach(() => {
    page = new CreatePage();
    page.navigateTo();
  });

  it('should navigate to create', () => {
    expect(browser.getCurrentUrl()).toContain('create');
  });

  describe('failing to create team', () => {
    it('should display error message if no board name input', () => {
      page.createRetroButton().click().then(() => {
        page.errorMessage().getText().then((errorMessageText) => {
          expect(errorMessageText).toContain('Please enter a team name');
        });
      });
    });
  });
});
