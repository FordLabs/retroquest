import { createTeamIfNecessary } from '../util/utils';

describe('Logging In', () => {
  const teamName = 'Login Tests';
  const teamId = 'login-tests';
  const password = 'Login1234';

  before(() => {
    createTeamIfNecessary(teamName, teamId, password);
    cy.visit('/login');
  });

  it('Navigates to team board after successful login', () => {
    cy.get('#teamNameInput').type(teamName);
    cy.get('#teamPasswordInput').type(password);
    cy.get('#signInButton').click();
    cy.url().should('eq', `http://localhost:4200/team/${teamId}`);
  });
});
