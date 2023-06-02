import { userBuilder } from "../builder/User";

describe("Register Page", () => {
  it("User should be able to register", () => {
    const user = userBuilder({})();
    cy.visit("/register");
    cy.screenshot();
    cy.findByLabelText(/user name/i).type(user.userName);
    cy.findByLabelText(/password/i).type(user.password);
    cy.findByText('Register').click();
    cy.url().should("contain", "/home");
    cy.screenshot();
  });
});
