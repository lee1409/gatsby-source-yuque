const yuqueTypes = require("./yuque-shema");
const { createNodeHelpers } = require("gatsby-node-helpers");

const SDK = require("@yuque/sdk");
const DOC = "Doc";
const DOC_DETAIL = "DocDetail";

exports.sourceNodes = async (
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
  const DocDetailNode = createNodeFactory(DOC_DETAIL);

  const client = new SDK({
    token: configOptions.token,
    requestOpts: {
      timeout: configOptions.timeout || 20000,
    },
  });

  const ignoreNotFoundElseRethrow = (err) => {
    console.log(err);
    if (err && err.response && err.response.status !== 404) {
      throw err;
    }
  };

  const fetchDoc = await client.docs
    .list({ namespace: configOptions.namespace })
    .then((docs) => {
      docs.forEach((doc) => {
        createNode(DocNode(doc));
      });
      return docs;
    })
    .catch(ignoreNotFoundElseRethrow);

  // Fetch all the document details
  return await Promise.all(
    fetchDoc.map((docs) => {
      return client.docs.get({
        namespace: configOptions.namespace,
        slug: docs.slug,
      });
    })
  ).then((docDetails) => {
    docDetails.forEach((docDetail) => {
      createNode(DocDetailNode(docDetail));
    });
  });
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  createTypes(yuqueTypes);
};
