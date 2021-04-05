const yuqueTypes = require("./yuque-shema");
const SDK = require("@yuque/sdk");

const client = new SDK({
  token: "VQRBsdP5Z3fPzz53PZUeDJB5ayppbCf9B1SGJgl5",
  // other options
});

exports.sourceNodes = ({ actions }, configOptions) => {
  const { createNode } = actions;

  const ignoreNotFoundElseRethrow = (err) => {
    if (err && err.response && err.response.status !== 404) {
      throw err;
    }
  };

  const fetchBook = client.repos
    .list({
      user: "u2373890",
    })
    .then((value) => {
      console.log(value);
    });

  const fetchDoc = client.docs
    .list({ namespace: "u2373890/frontend" })
    .then((value) => {
      console.log(value);
    });

  return Promise.all([fetchBook, fetchDoc]);
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  createTypes(yuqueTypes);
};
