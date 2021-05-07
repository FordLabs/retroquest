export interface TeamCredentials {
  teamName: string;
  teamId: string;
  password: string;
  jwt: string;
}

export function teamBoardUrl(teamId: string): string {
  console.log(`**** ${teamId} *****`);
  return `http://localhost:4200/team/${teamId}`;
}

export function goToTeamBoard(teamCredentials: TeamCredentials) {
  cy.visit(teamBoardUrl(teamCredentials.teamId), {
    headers: {
      bearer: teamCredentials.jwt,
    },
  });
}

function enterText(selector: string, textToEnter: string) {
  cy.get(selector).type(textToEnter);
}

function click(selector: string) {
  cy.get(selector).click();
}

function login(teamCredentials: TeamCredentials) {
  cy.visit('/login');
  enterText('#teamNameInput', teamCredentials.teamName);
  enterText('#teamPasswordInput', teamCredentials.password);
  click('#signInButton');
}

function createBoard(teamCredentials: TeamCredentials) {
  cy.visit('/create');
  enterText('#teamNameInput', teamCredentials.teamName);
  enterText('#teamPasswordInput', teamCredentials.password);
  enterText('#teamPasswordConfirmInput', teamCredentials.password);
  click('#createRetroButton');
}

export function createTeamIfNecessaryAndLogin(
  teamCredentials: TeamCredentials
) {
  cy.request({
    url: `http://localhost:4200/api/team/login`,
    failOnStatusCode: false,
    method: 'POST',
    body: {
      name: teamCredentials.teamName,
      password: teamCredentials.password,
      captchaResponse: null,
    },
  }).then((response) => {
    console.log(response.body);
    if (response.status === 200) {
      teamCredentials.jwt = response.body;
      login(teamCredentials);
    } else {
      createBoard(teamCredentials);
    }
  });
}
