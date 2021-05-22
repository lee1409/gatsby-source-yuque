import { createNodeHelpers } from "gatsby-node-helpers";
import SDK from "@yuque/sdk";
import yuqueTypes from "./yuque-schema";
import fromMarkDown from "mdast-util-from-markdown";
import toMarkdown from "mdast-util-to-markdown";
import { createRemoteFileNode } from "gatsby-source-filesystem";
import visitWithParents from "unist-util-visit-parents";
import { slash } from 'gatsby-core-utils';

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

  const fetchDoc = await client.docs.list({
    namespace: configOptions.namespace,
  });
  await Promise.all(fetchDoc.map((doc) => createNode(DocNode(doc))));

  // Fetch all the document details
  const docDetails = await Promise.all(
    fetchDoc.map((docs) => {
      return client.docs.get({
        namespace: configOptions.namespace,
        slug: docs.slug,
      });
    })
  ).catch(ignoreNotFoundElseRethrow);

  await Promise.all(
    docDetails.map((docDetail) => createNode(DocDetailNode(docDetail)))
  );
};

exports.onCreateNode = async ({
  node,
  cache,
  actions,
  createNodeId,
  createContentDigest,
}) => {
  const { createNode, createParentChildLink } = actions;
  if (node.internal.type !== "YuqueDocDetail") {
    return;
  }

  // Add support to extending markdown node
  // Download required images into local
  let tree = fromMarkDown(node.body);
  let matches = [];

  visitWithParents(tree, ["image"], function (node) {
    matches.push(node);
  });

  let promises = [];
  let rootDir;

  const markdownNode = {
    id: createNodeId(`${node.id} >>> YuqueMarkdown`),
    children: [],
    parent: node.id,
    internal: {
      type: `YuqueMarkdown`,
      mediaType: "text/markdown",
    },
  };

  // Downlaod all the images
  // And change remote URL to local path
  for (let match of matches) {
    promises.push(
      createRemoteFileNode({
        url: match.url,
        cache,
        createNode,
        createNodeId,
        parentNodeId: markdownNode.id,
      })
        .then((fileNode) => {
          // Need to make it the relative path
          let path = fileNode.absolutePath.split("/");
          let relativePath = path.slice(-2, fileNode.absolutePath.length);
          match.url = relativePath.join("/");

          if (!rootDir) rootDir = path.slice(0, -2).join('/');
        })
        .catch((err) => console.log(err))
    );
  }
  await Promise.all(promises);

  let str = toMarkdown(tree);
  // Create a new node and form a new str
  // Form a node back to original
  markdownNode.dir = slash(rootDir);
  markdownNode.internal.content = str;
  markdownNode.internal.contentDigest = createContentDigest(markdownNode);
  await createNode(markdownNode);
  await createParentChildLink({ parent: node, child: markdownNode });
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  createTypes(yuqueTypes);
};
