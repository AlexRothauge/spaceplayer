import { userBuilder } from "../builder/User";

describe("Guest Page", () => {
  it("should be able to render the Guest Page", () => {
    cy.visit("/");
    cy.url().should("contain", "/guestmode");
    cy.screenshot();
  });

  it("should be able to move to the Register Page", () => {
    cy.visit("/");
    cy.findByText(/register/i).click();
    cy.url().should("contain", "/register");
  });

  it("should be able to move to the login Page", () => {
    cy.visit("/");
    cy.findByText(/login/i).click();
    cy.url().should("contain", "/login");
  });

  it("User should be able to login as guest", () => {
    const user = userBuilder({})();
    cy.visit("/guestmode");
    cy.screenshot();
    cy.findByLabelText(/user name/i).type(user.userName);
    cy.findByText(/go to play/i).click();
    cy.url().should("contain", "/home");
    cy.screenshot();
  });
});
