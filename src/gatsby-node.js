import { createNodeHelpers } from "gatsby-node-helpers";
import SDK from "@yuque/sdk";
import yuqueTypes from "./yuque-schema";
import fromMarkDown from "mdast-util-from-markdown";
import toMarkdown from "mdast-util-to-markdown";
import { createRemoteFileNode } from "gatsby-source-filesystem";
import visitWithParents from "unist-util-visit-parents";

const DOC = "Doc";
const DOC_DETAIL = "DocDetail";

exports.sourceNodes = async (
  { actions, createNodeId, createContentDigest, cache },
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

  // Get all the documents
  const docs = await client.docs.list({
    namespace: configOptions.namespace,
  });
  await Promise.all(docs.map((doc) => createNode(DocNode(doc))));

  // Fetch all the document details
  const docDetails = await Promise.all(
    docs.map((doc) => {
      return client.docs.get({
        namespace: configOptions.namespace,
        slug: doc.slug,
      });
    })
  );
  for (let docDetail of docDetails) {
    let matches = [];
    let promiseImages = [];
    
    docDetail = DocDetailNode(docDetail);
    docDetail.dir = null;

    let tree = fromMarkDown(docDetail.body);
    visitWithParents(tree, ["image"], function (node) {
      matches.push(node);
    });

    matches.forEach((match) => {
      promiseImages.push(
        createRemoteFileNode({
          url: match.url,
          cache,
          createNode,
          createNodeId,
          parentNodeId: docDetail.id,
        })
          .then((fileNode) => {
            // Need to make it the relative path
            let path = fileNode.absolutePath.split("/");
            let relativePath = path.slice(-2, fileNode.absolutePath.length);
            match.url = relativePath.join("/");

            if (!docDetail.dir) docDetail.dir = path.slice(0, -2).join("/");
          })
          .catch((err) => console.error(err))
      );
    });

    await Promise.all(promiseImages);

    let output = toMarkdown(tree);
    docDetail.internal = {
      ...docDetail.internal,
      content: output,
      contentDigest: createContentDigest(output),
      mediaType: "text/markdown",
    };
    createNode(docDetail);
  }
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  createTypes(yuqueTypes);
};
