import { userBuilder } from "../builder/User";

describe("LoginPage", () => {
  it("should be able to move to the Register Page", () => {
    cy.visit("/");
    cy.findByText(/register/i).click();
    cy.url().should("contain", "/register");
  });

  it("should be able to login", () => {
    cy.createUser({}).then((user) => {
      cy.visit("/login");
      cy.screenshot();
      cy.findByLabelText(/user name/i).type(user.userName);
      cy.findByLabelText(/password/i).type(user.password);
      cy.findByText(/log in/i).click();
      cy.url().should("contain", "/home");
      cy.screenshot();
    });
  });
});
