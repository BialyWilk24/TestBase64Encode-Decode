class pageDecoder {
    constructor() {
        this.url = 'https://base64.guru/converter/decode/image';
        this.selectors = {
            decodeTextArea: `textarea[name="base64"]`,
            decodeBtn: `button[name="decode"]`,
            imagePreview: 'img[onload="form_base64_decode_preview(this)"]',
            errorMessageSelector: '.form-messages-errors'
        };
    }

    visit() {
        cy.visit(this.url);
        return this;
    }
    enterBase64(base64) {
        cy.get(this.selectors.decodeTextArea)
            .as('DecodeTextArea')
            .should('exist')
            .should('be.visible')
            .should('not.be.disabled')
            .invoke('val', base64)
            .trigger('input');
        return this;
    }
    clickDecodeBtn() {
        cy.get(this.selectors.decodeBtn)
            .should('be.visible')
            .should('contain.text', 'Decode Base64 to Image')
            .click();
        return this;
    }
    checkImageDecoded(base64) {
        cy.get('body').then(($body) => {
            const $image = $body.find(this.selectors.imagePreview);

            if ($image.length > 0) {
                cy.wrap($image)
                    .should('be.visible')
                    .and('have.attr', 'src')
                    .and('match', /^data:image\/jpeg;base64,/)
                    .and('include', base64);
            } else {
                cy.log('Error: Image is not decoded');
                cy.get(this.selectors.errorMessageSelector, { timeout: 3000 })
                    .should('be.visible')
                    .and(
                        'contain.text',
                        'Cannot decode Base64 value. Try to use the Base64 decoder, which is able to decode various standards.'
                    ).then(() => {
                        throw new Error('The image has not been decoded. img#decoded_image was expected.');
                    });
            }
        });

        return this;
    }

}
export default new pageDecoder();