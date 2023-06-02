import { userBuilder } from "../builder/User";

describe("Home page", () => {
  
  it("should be able to render the Home page and create a Room", () => {
    const user = userBuilder({})();
    cy.visit("/guestmode");
    cy.screenshot();
    cy.findByLabelText(/user name/i).type(user.userName);
    cy.findByText(/go to play/i).click();
    cy.url().should("contain", "/home");
    cy.screenshot();

    cy.findByLabelText(/Max Clients:/i).type(7);
    cy.findByLabelText(/Max Astroids:/i).type(5);
    cy.findByLabelText(/Max Enemys:/i).type(3);
    cy.findByText(/Create Room/i).click();
    cy.screenshot();

  });
  
  it("should be able to logout", () => {
    const user = userBuilder({})();
    cy.visit("/guestmode");
    cy.screenshot();
    cy.findByLabelText(/user name/i).type(user.userName);
    cy.findByText(/go to play/i).click();
    cy.url().should("contain", "/home");
    cy.screenshot();

    cy.findByText(/Logout/i).click();
    cy.url().should("contain", "/guestmode");
    cy.screenshot();

  });
});