describe('Create farmlist', () => {
  it('Get inactive players', () => {
    login();
    getInactivePlayerCoordinates();
  })
})

const login = () => {
  cy.visit('https://www.gettertools.com/ts2.x1.europe.travian.com.2/');
  cy.get('.-accept-all').click();

  cy.get(':nth-child(2) > .input > .textinput').type('indy.naessens@pm.me');
  cy.get(':nth-child(3) > .input > .textinput').type('pw');
  cy.get(':nth-child(4) > .aicon').click();
}

const getInactivePlayerCoordinates = () => {
  // get to advanced inactive search tool
  cy.get('[href="/ts2.x1.europe.travian.com.2/2-Region-Inactives"] > span').click();
  cy.get('.absatzBack > a.abs').click();

  // fill in needed date
  cy.get('#xyX').clear().type('78');
  cy.get('#xyY').clear().type('-87');
  cy.get('#range').as('range').invoke('val', 100).trigger('change');
  cy.get('#maxSpielerCitys').as('range').invoke('val', 1).trigger('change');
  cy.get('#maxSpielerEW').clear().type('100');
  cy.get('#nataren').click();
  cy.get('#speed').clear().type('19');

  // search for inactive players and parse coordinates
  cy.get('[colspan="2"] > .stylebutton').click();
  cy.get('tbody').find('.koord').each(element => {
    const coordinates = element.text();

    const x = coordinates.split('|')[0].split('(')[1].trim();
    const y = coordinates.split('|')[1].split(')')[0].trim();

    cy.log(`Found ${x} and ${y}`);
  })
}