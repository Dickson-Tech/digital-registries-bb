const pactum = require('pactum');
const { Given, When, Then, Before, After } = require('@cucumber/cucumber');
const { header, localhost } = require('./helpers/helpers');

let userActualVariables;
let userUpdateVariables;
let specDataUpdate;

const baseUrl = `${localhost}data/registry1/version1/update`;

Before(() => {
  specDataUpdate = pactum.spec();
});

// Scenario: The user successfully updates the record in the Digital Registries database
Given(
  'The user wants to update a record in the Digital Registries database and a record exists',
  () =>
    (userActualVariables = {
      ID: 'EE378627348834',
      FirstName: 'John Helmut',
      LastName: 'Smith Carry',
      BirthCertificateID: 'RR-1234567889',
    }),

  (userUpdateVariables = {
    ID: 'EE378627348834',
    FirstName: 'John Helmut',
    LastName: 'Lasocki',
    BirthCertificateID: 'RR-1234567889',
  })
);

When('The user triggers an action to update the record in the database', () => {
  specDataUpdate
    .put(`${baseUrl}`)
    .withHeaders(`${header.key}`, `${header.value}`)
    .withBody({
      query: {
        content: userActualVariables,
      },
      write: {
        content: userUpdateVariables,
      },
    });
});

Then('Operation to update a record finishes successfully', async () => {
  await specDataUpdate.toss();
  specDataUpdate.response().should.have.status(200);
  specDataUpdate.response().should.have.jsonLike({
    content: userUpdateVariables,
  });
});

// Scenario: The user is not able to update the record, because the record does not exist in the Digital Registries database
Given(
  'The user wants to update the record in the Digital Registries database and the record does not exist',
  () =>
    (userActualVariables = {
      ID: 'EE378627348855',
      FirstName: 'Anna',
      LastName: 'Smith',
      BirthCertificateID: 'RR-1234567880',
    }),

  (userUpdateVariables = {
    ID: 'EE378627348855',
    FirstName: 'Jasmine',
    LastName: 'Lasocki',
    BirthCertificateID: 'RR-1234567880',
  })
);

// "When" is already written in line 34-46

Then(
  'Operation results to update the record is an error because the record does not exist in the database',
  async () => {
    await specDataUpdate.toss();
    specDataUpdate.response().should.have.status(404);
    specDataUpdate
      .response()
      .should.have.body('{\n  "Record matching query not found."\n}');
  }
);

// Scenario: The user is not able to update a record in the Digital Registries database because of an invalid request
// "Given" is already written in line 16-32

When(
  'The user triggers an action to update a new record in the database with an invalid request',
  () => {
    specDataUpdate
      .put(`${baseUrl}`)
      .withHeaders(`${header.key}`, `${header.value}`);
  }
);

Then(
  'Operation results to update a record is an error because of an invalid request',
  async () => {
    await specDataUpdate.toss();
    specDataUpdate.response().should.have.status(400);
    specDataUpdate.response().should.have.body('{\n  "Query not provided."\n}');
  }
);

After(() => {
  specDataUpdate.end();
});
