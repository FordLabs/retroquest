import {AppPage} from './app.po';
import {browser} from 'protractor';

describe('App root page', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('home page should redirect to login', () => {
    page.navigateTo();
    expect(browser.getCurrentUrl()).toContain('login');
  });
});
