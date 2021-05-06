const yuqueTypes = require("./yuque-shema");
const { createNodeHelpers } = require("gatsby-node-helpers");

const SDK = require("@yuque/sdk");
const DOC = "Doc";

exports.sourceNodes = (
  { actions, createNodeId, createContentDigest },
  configOptions
) => {
  const { createNode } = actions;

  const { createNodeFactory } = createNodeHelpers({
    typePrefix: "Yuque",
    createNodeId,
    createContentDigest,
  });

  const DocNode = createNodeFactory(DOC);

  const client = new SDK({
    token: configOptions.token,
  });

  const ignoreNotFoundElseRethrow = (err) => {
    console.log(err);
    if (err && err.response && err.response.status !== 404) {
      throw err;
    }
  };

  const fetchDoc = client.docs
    .list({ namespace: configOptions.namespace })
    .then((docs) => {
      docs.forEach((doc) => {
        createNode(DocNode(doc));
      });
    })
    .catch(ignoreNotFoundElseRethrow);

  return fetchDoc;
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  createTypes(yuqueTypes);
};
