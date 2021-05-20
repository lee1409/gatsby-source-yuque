const { createNodeHelpers } = require("gatsby-node-helpers");
import { fetchRemoteFile } from "gatsby-core-utils";
import remark from "remark";
import remarkImgLink from "./remark-img-links";
import { createNodeHelpers } from "gatsby-node-helpers";
import SDK from "@yuque/sdk";
import yuqueTypes from "./yuque-schema";
import stringify from "remark-stringify";
import { fetchRemoteFile } from "gatsby-core-utils";
import fromMarkDown from 'mdast-util-from-markdown';

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
