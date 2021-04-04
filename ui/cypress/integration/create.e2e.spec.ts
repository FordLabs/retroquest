describe('Create Page', () => {
  const teamName = 'Create Board Tests';
  const teamId = 'create-board-tests';
  const password = 'Test1234';

  describe('navigation', () => {
    it('should be able to navigate to /create', () => {
      cy.visit('/create');
      cy.url().should('eq', 'http://localhost:4200/create');
    });

    it('should be able to navigate to /login from link', () => {
      cy.visit('/create');
      cy.get('#loginBoard').click();
      cy.url().should('eq', 'http://localhost:4200/login');
    });
  });

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
