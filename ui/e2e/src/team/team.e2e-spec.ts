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
        // waiting for angular is broken when using websockets
        // we are toggling waitForAngularEnabled as a workaround
        browser.waitForAngularEnabled(false);
        done();
      });
    }).catch((error) => {
      console.error('failed to log into board: ', error);
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

  it('should render the download csv button', () => {
    expect(page.downloadCsvButton().isPresent()).toBeTruthy();
  });

  it('should render the end retro button', () => {
    expect(page.endRetroButton().isPresent()).toBeTruthy();
  });

  it('should render four retroquest columns', () => {
    expect(page.rqColumns().count()).toBe(4);
  });
});
