import {
  createTeamIfNecessaryAndLogin,
  teamBoardUrl,
  TeamCredentials,
} from '../util/utils';

describe('Logging In', () => {
  const teamCredentials = {
    teamName: 'Login Tests',
    teamId: 'login-tests',
    password: 'Login1234',
    jwt: '',
  } as TeamCredentials;

  before(() => {
    createTeamIfNecessaryAndLogin(teamCredentials);
    cy.visit('/login');
  });

  it('Navigates to team board after successful login', () => {
    cy.get('#teamNameInput').type(teamCredentials.teamName);
    cy.get('#teamPasswordInput').type(teamCredentials.password);
    cy.get('#signInButton').click();
    cy.url().should('eq', teamBoardUrl(teamCredentials.teamId));
  });
});
