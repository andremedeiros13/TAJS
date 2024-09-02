import { Then } from "@badeball/cypress-cucumber-preprocessor";
import { registerForm } from "../common/registerForm.cy.js";

Then('the list of registered images should be updated with the new item', () => {
    registerForm.typeTitle('BR Alien 2');
    registerForm.typeUrl('https://cdn.mos.cms.futurecdn.net/eM9EvWyDxXcnQTTyH8c8p5-1200-80.jpg');
    registerForm.clickSubmit();
    cy.wait(2000);
});

Then('the new item should be stored in the localStorage', () => {
    cy.getAllLocalStorage().then((result) => {
        const aliens = result[Cypress.config("baseUrl")];
        const objects = JSON.parse(aliens['tdd-ew-db']);
        assert.equal(objects.length, 2)
      });
  });