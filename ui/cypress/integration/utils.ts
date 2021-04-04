let count = 0;

export async function createTeamIfNecessary(
  teamName: string,
  teamId: string,
  password: string
) {
  count++;
  console.log('Logged in ' + count + ' times');
  const urlTeamBoard = `http://localhost:4200/team/${teamId}`;

  cy.visit(urlTeamBoard);

  const url = await cy.url();

  if (url === urlTeamBoard) {
    return;
  }

  cy.get('#teamNameInput').then((teamNameInput) => {
    function createTeam() {
      cy.visit('/create');
      cy.get('#teamNameInput').type(teamName);
      cy.get('#teamPasswordInput').type(password);
      cy.get('#teamPasswordConfirmInput').type(password);
      cy.get('#createRetroButton').click();
    }

    function login() {
      cy.get('#teamPasswordInput').type(password);
      cy.get('#signInButton').click();
    }

    if (teamNameInput.val().trim() === '') {
      createTeam();
    } else {
      login();
    }
  });
}
