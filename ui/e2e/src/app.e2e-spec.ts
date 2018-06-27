import { AppPage } from './app.po';
import { browser } from 'protractor';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should navigate to create', () => {
    page.navigateTo();
    expect(browser.getCurrentUrl()).toContain('create');
  });
});
