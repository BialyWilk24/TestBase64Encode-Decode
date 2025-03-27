import pageEncoder from "../pages/pageEncoder";
import pageDecoder from "../pages/pageDecoder";
describe('Test encode and decode base64', () => {
    it('Go to the encode page and download image', () => {
        pageEncoder.visit()
            .allowCookies()
            .checkdragAndDropFiled()
            .interceptApiRequest()
            .uploadFile('image.jpg')
            .waitApiRequestAndSaveBase64()
            .copyImage()
            .getTextFromCopyBtn()
            .compareBase64InFile()
            .compareBase64inClipboard();

    });
    it('Go to the decode page and paste base64 code', () => {
        cy.readFile("cypress/fixtures/base64Data.json").then((data) => {
            expect(data).to.have.property('base64');
            expect(data.base64).to.not.be.empty;
            const base64FromEnv = data.base64;
            pageDecoder.visit()
                .enterBase64(base64FromEnv)
                .clickDecodeBtn()
                .checkImageDecoded(base64FromEnv);
        });
    });
});