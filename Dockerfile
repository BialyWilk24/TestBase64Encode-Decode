FROM cypress/included:13.6.6

WORKDIR /app

COPY package.json package-lock.json ./
COPY cypress.config.js ./
COPY cypress/ ./cypress/

RUN npm install

CMD ["npx", "cypress", "run", "--spec", "cypress/e2e/base64.cy.js"]

