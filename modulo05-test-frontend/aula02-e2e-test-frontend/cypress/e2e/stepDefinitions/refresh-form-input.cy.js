import { Then, When } from "@badeball/cypress-cucumber-preprocessor";
import { registerForm } from "../common/registerForm.cy.js";

Then('I have submitted an image', () => {
    registerForm.typeTitle('BR Alien');
    registerForm.typeUrl('https://cdn.mos.cms.futurecdn.net/eM9EvWyDxXcnQTTyH8c8p5-1200-80.jpg');
    registerForm.clickSubmit();
    cy.wait(2000);
});

When('I refresh the page', () => {
    cy.reload();
});

Then('I should still see the submitted image in the list of registered images', () => {
    cy.get('#card-list').children().last().should('contain.text', 'BR Alien');
  });