import { Then } from "@badeball/cypress-cucumber-preprocessor";
import { registerForm } from "../common/registerForm.cy.js";


Then("I should see a check icon in the title field", () => {
  cy.get("#title:valid").should("have.length", 1);
});

Then('I should see a check icon in the imageUrl field', () => {
    registerForm.elements.imageUrlInput().siblings('.input-group-text').should('contain.text', '📸');
  });
Then('The inputs should be cleared', () => {
    registerForm.elements.titleInput().should('have.value', '');
    registerForm.elements.imageUrlInput().should('have.value', '');
});

