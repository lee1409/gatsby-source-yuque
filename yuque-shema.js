const types = `
type YuqueBook implements Node {
  id: ID!
  type: String!
  slug: String!
  name: String!
  user_id:
  description: String!
  creator_id:
  public: Int
  items_count: Int
  likes_count: Int
  watches_count: Int
  content_updated_at: Date @dateformat
  updated_at: Date @dateformat
  created_at: Date @dateformat
  namespace: String!
  user: 
  _serializer: String
}

type YuqueDoc implements Node {
  id: ID!
  slug: String!
  title: String!
  user_id: ...
  format: String!
  public: Int!
  status: Int!
  likes_count: Int!
  comments_count: Int!
  content_updated_at: String!
  book:
  user: 
  last_editor:
  created_at: Date! @dateformat
  updated_at: Date! @dateformat
  published_at: Date @dateformat
  first_published_at: Date @dateformat
  draft_version: Int
  last_editor_id: 
  word_count: Int
  cover: 
  custom_description: 
  last_editor: 
  book: 
  _serializer: String
}

type YuqueDocDetail implements Node {
  id: ID!
  slug: String!
  title: String!
  book_id: Int!
  book: 
  user_id: Int!
  creator: 
  format: String!
  body: String
  body_draft: String
  body_html: String
  body_lake: String
  body_draft_lake: String
  public: Int
  status: Int
  view_status: Int
  read_state: Int
  likes_count: Int
  comments_count: Int
  content_updated_at: Date @dateformat
  deleted_at: Date @dateformat
  created_at: Date! @dateformat
  updated_at: Date! @dateformat
  published_at: Date! @dateformat
  first_published_at: Date! @dateformat
  word_count: Int
  cover: String
  description: String
  custom_description: String
  hits: Int
  _serializer: String
}
 `;

module.exports = types;
