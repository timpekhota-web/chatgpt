describe('Home page', () => {
  it('loads landing', () => {
    cy.visit('/');
    cy.contains('Startup Shop');
  });
});
