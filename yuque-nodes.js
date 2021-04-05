const createNodeHelpers = require("gatsby-node-helpers").default;

const { createNodeFactory } = createNodeHelpers({
  typePrefix: "Yuque",
});

const BOOK = "Book";
const DOC = "Doc";

const PostNode = createNodeFactory(BOOK);
const PageNode = createNodeFactory(DOC);

module.exports = {
  PostNode,
  PageNode,
};
