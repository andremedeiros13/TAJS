import { Then } from "@badeball/cypress-cucumber-preprocessor";
import { registerForm } from "./../common/registerForm.cy.js";

Then('I should see {string} message above the title field', (text) => {
    registerForm.elements.titleFeedBack().should('contain.text', text);
});

Then('I should see {string} message above the imageUrl field', (url) => {
    registerForm.elements.urlFeedback().should('contain.text', url);
});

Then('I should see an exclamation icon in the title and URL fields', () => {
    registerForm.elements.titleInput().siblings('.input-group-text').should('contain.text', '💥');
    registerForm.elements.imageUrlInput().siblings('.input-group-text').should('contain.text', '📸');
});
