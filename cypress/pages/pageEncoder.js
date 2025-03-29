class pageEncoder {
    constructor() {
        this.url = 'https://www.base64-image.de/';
        this.selectors = {
            dragAndDropField: '#drag-target',
            fileInput: 'body > input[type="file"]',
            copyImageBtn: '.dz-copy-image.btn-xs',
            allowCookiesBtn: '#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll'
        };
    }

    visit() {
        cy.visit(this.url);
        return this;
    }
    allowCookies() {
        cy.get(this.selectors.allowCookiesBtn)
            .should('be.visible')
            .should('contain.text', 'Allow all')
            .click();
        return this;
    }
    checkdragAndDropFiled() {
        cy.get(this.selectors.dragAndDropField)
            .should('be.visible')
            .click();
        return this;
    }
    uploadFile(fileName) {
        cy.get(this.selectors.fileInput).attachFile(fileName);
        return this;
    }
    interceptApiRequest() {
        cy.intercept('POST', 'https://www.base64-image.de/encode', (req) => {
        }).as('apiRequestEncode');
        return this;
    }
    waitApiRequestAndSaveBase64() {
        cy.wait('@apiRequestEncode').its('response')
            .should((response) => {
                expect(response.statusCode, 'A status code has been returned:').to.be.within(200, 399);
            })
            .then((response) => {
                cy.log(response.body);
                cy.log(response.body.base64);
                expect(response.body.base64).to.be.a('string');
                expect(response.body.base64.length).to.be.greaterThan(0);
                Cypress.env('base64Resp', response.body.base64);
                cy.writeFile("cypress/fixtures/base64Data.json", { base64: response.body.base64 });
            });
        return this;
    }
    copyImage() {
        cy.get(this.selectors.copyImageBtn)
            .as('copyImageBtn')
            .should('be.visible')
            .should('contain.text', 'copy image')
            .click();
        return this;
    }
    getTextFromCopyBtn() {
        cy.get('@copyImageBtn').should('contain.text', 'Copied!');
        return this;
    }
    compareBase64InFile() {
        cy.fixture('image.jpg').then((fileContent) => {
            const base64Data = fileContent.replace(/^data:image\/\w+;base64,/, '');

            cy.log('base64:', base64Data);
            expect(base64Data).to.equal(Cypress.env('base64Resp'));
        });
        return this;
    }
    compareBase64inClipboard() {
        cy.window().then((win) => {
            return win.navigator.clipboard.readText().then((text) => {
                cy.log(text);
                const base64text = text.replace(/^data:image\/\w+;base64,/, '');
                expect(base64text).to.equal(Cypress.env('base64Resp'));
            });
        });
        return this;
    }



}
export default new pageEncoder;