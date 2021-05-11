const types = `
type YuqueDoc implements Node {
  id: Int!
  slug: String!
  title: String!
  user_id: Int!
  book_id: Int!
  format: String!
  public: Int!
  status: Int!
  view_status: Int!
  read_status: Int!
  likes_count: Int!
  comments_count: Int!
  content_updated_at: Date @dateformat
  created_at: Date @dateformat
  updated_at: Date @dateformat
  published_at: Date @dateformat
  first_published_at: Date @dateformat
  draft_version: Int!
  last_editor_id: Int!
  word_count: Int!
  cover: String
  custom_description: String
  last_editor: User
  book: Book
  _serializer: String
}

type YuqueDocDetail implements Node {
  id: Int!
  slug: String!
  title: String!
  book_id: Int!
  book: Book!
  user_id: Int!
  creator: User!
  format: String!
  body: String
  body_draft: String
  body_html: String!
  body_lake: String
  body_draft_lake: String
  public: Int!
  status: Int!
  view_status: Int!
  read_state: Int!
  likes_count: Int!
  comments_count: Int!
  content_updated_at: Date @dateformat
  deleted_at: Date @dateformat
  created_at: Date @dateformat
  updated_at: Date @dateformat
  published_at: Date @dateformat
  first_published_at: Date @dateformat
  word_count: Int
  cover: String
  description: String
  custom_description: String
  hits: Int
  _serializer: String
}

type Book implements Node {
  id: Int!
  type: String!
  slug: String!
  name: String
  user_id: Int
  description: String
  creator_id: Int
  public: Int
  items_count: Int
  likes_count: Int
  watches_count: Int
  content_updated_at: Date @dateformat
  updated_at: Date @dateformat
  created_at: Date @dateformat
  namespace: String
  user: User
  _serializer: String!
}

type User implements Node {
  id: Int!
  type: String!
  login: String!
  name: String!
  description: String!
  avatar_url: String!
  books_count: Int!
  public_books_count: Int!
  followers_count: Int!
  following_count: Int!
  created_at: Date @dateformat
  updated_at: Date @dateformat
  _serializer: String!
}
 `;

module.exports = types;
