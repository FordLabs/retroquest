describe('Create Page', () => {
  const teamName = 'Test Team Name';
  const teamId = 'test-team-name';
  const password = 'Test1234';
  //
  // describe('navigation', () => {
  //     it('should be able to navigate to /create', () => {
  //         cy.visit('/create');
  //         cy.url().should('eq', 'http://localhost:4200/create');
  //     });
  //
  //     it('should be able to navigate to /login from link', () => {
  //         cy.visit('/create');
  //         cy.get('#loginBoard').click();
  //         cy.url().should('eq', 'http://localhost:4200/login');
  //     });
  // });
  //
  // describe('form validation', () => {
  //
  //     beforeEach(() => {
  //         cy.visit('/create');
  //     });
  //
  //     it('must have a valid team name', () => {
  //         cy.get('#teamPasswordInput').type(password);
  //         cy.get('#teamPasswordConfirmInput').type(password);
  //         cy.get('#createRetroButton').click();
  //         cy.get('#errorMessage').should('contain.text', 'Please enter a team name');
  //     });
  //
  //     it('must have a password', () => {
  //         cy.get('#teamNameInput').type(teamName);
  //         cy.get('#teamPasswordConfirmInput').type(password);
  //         cy.get('#createRetroButton').click();
  //         cy.get('#errorMessage').should('contain.text', 'Please enter a password');
  //     });
  //
  //     it('must have a confirm password', () => {
  //         cy.get('#teamNameInput').type(teamName);
  //         cy.get('#teamPasswordInput').type(password);
  //         cy.get('#createRetroButton').click();
  //         cy.get('#errorMessage').should('contain.text', 'Please enter matching passwords');
  //     });
  //
  //     it('Password must contain a capital letter', () => {
  //         cy.get('#teamNameInput').type(teamName);
  //         cy.get('#teamPasswordInput').type('test1234');
  //         cy.get('#teamPasswordConfirmInput').type('test1234');
  //         cy.get('#createRetroButton').click();
  //         cy.get('#errorMessage').should('contain.text', 'Password must contain at least one capital letter.');
  //     });
  //
  //     it('Password must contain a lowercase letter', () => {
  //         cy.get('#teamNameInput').type(teamName);
  //         cy.get('#teamPasswordInput').type('TEST1234');
  //         cy.get('#teamPasswordConfirmInput').type('TEST1234');
  //         cy.get('#createRetroButton').click();
  //         cy.get('#errorMessage').should('contain.text', 'Password must contain at least one lower case letter.');
  //     });
  //
  //     it('Password must contain a number', () => {
  //         cy.get('#teamNameInput').type(teamName);
  //         cy.get('#teamPasswordInput').type('TESTtest');
  //         cy.get('#teamPasswordConfirmInput').type('TESTtest');
  //         cy.get('#createRetroButton').click();
  //         cy.get('#errorMessage').should('contain.text', 'Password must contain at least one numeric character.');
  //     });
  //
  //     it('Password must be 8 characters long', () => {
  //         cy.get('#teamNameInput').type(teamName);
  //         cy.get('#teamPasswordInput').type('Te1');
  //         cy.get('#teamPasswordConfirmInput').type('Te1');
  //         cy.get('#createRetroButton').click();
  //         cy.get('#errorMessage').should('contain.text', 'Password must be 8 characters or longer.');
  //     });
  //
  // });

  describe('default board creation', () => {
    async function createTeamIfNecessary() {
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

    beforeEach(() => {
      createTeamIfNecessary();
    });

    describe('Sections', () => {
      describe('Happy Section', () => {
        it('Has a Happy Column Header', () => {
          cy.findByText('Happy');
        });

        it('The Happy Column Header is Green', () => {
          cy.findByText('Happy').then((happyElement) => {
            expect(
              window.getComputedStyle(happyElement.parent()[0]).backgroundColor
            ).toEqual('rgb(46, 204, 113)');
          });
        });
      });

      describe('Confused Section', () => {
        it('Has a Happy Confused Header', () => {
          cy.findByText('Confused');
        });

        it('The Confused Column Header is Green', () => {
          cy.findByText('Confused').then((happyElement) => {
            expect(
              window.getComputedStyle(happyElement.parent()[0]).backgroundColor
            ).toEqual('rgb(52, 152, 219)');
          });
        });
      });

      describe('Sad Section', () => {
        it('Has a Sad Sad Header', () => {
          cy.findByText('Sad');
        });

        it('The Sad Column Header is Green', () => {
          cy.findByText('Sad').then((happyElement) => {
            expect(
              window.getComputedStyle(happyElement.parent()[0]).backgroundColor
            ).toEqual('rgb(231, 76, 60)');
          });
        });
      });

      describe('Action Items Section', () => {
        it('Has a Action Items Column Header', () => {
          cy.findByText('Action Items');
        });

        it('The Action Items Column Header is Green', () => {
          cy.findByText('Action Items').then((happyElement) => {
            expect(
              window.getComputedStyle(happyElement.parent()[0]).backgroundColor
            ).toEqual('rgb(241, 196, 15)');
          });
        });
      });
    });
  });
});
