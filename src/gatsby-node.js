const { createNodeHelpers } = require("gatsby-node-helpers");
import { fetchRemoteFile } from "gatsby-core-utils";
const SDK = require("@yuque/sdk");
const yuqueTypes = require("./yuque-shema");

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
  const docDetails = await Promise.all(
    fetchDoc.map((docs) => {
      return client.docs.get({
        namespace: configOptions.namespace,
        slug: docs.slug,
      });
    })
  ).catch(ignoreNotFoundElseRethrow);

  for (let docDetail of docDetails) {
    // TODO parsing?
    console.log(docDetail);
    break;
  }

  return Promise.all(
    docDetails.map((docDetail) => createNode(DocDetailNode(docDetail)))
  );
};

exports.onCreateNode = async ({ node }) => {
  if (node.internal.type !== "YuqueDocDetail") {
    return;
  }
  console.log(node);
  return;
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  createTypes(yuqueTypes);
};
