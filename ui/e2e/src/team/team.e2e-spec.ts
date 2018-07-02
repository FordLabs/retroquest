import { TeamPage } from './team.po';
import { browser } from 'protractor';

describe('Team Page', () => {
  let page: TeamPage;
  let teamData: { id, name };

  beforeEach((done) => {
    page = new TeamPage();

    page.loginToRandomBoard().then((randomTeamData) => {
      teamData = randomTeamData;
      page.navigateTo(teamData.id).then(() => {
        // waiting for anuglar is broken when using websockets
        // we are toggling waitForAngularEnabled as a workaround
        browser.waitForAngularEnabled(false);
        done();
      });
    });
  });

  afterEach(() => {
    browser.waitForAngularEnabled(true);
  });

  it('should have team-id in the url', () => {
    expect(browser.getCurrentUrl()).toContain(`/team/${teamData.id}`);
  });

  it('should render the team name', () => {
    expect(page.teamName().getText()).toBe(teamData.name);
  });

  it('should render the feedback button', () => {
    expect(page.feedbackButton().isPresent()).toBeTruthy();
  });
});
