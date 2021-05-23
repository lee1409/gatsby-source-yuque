# Gatsby source yuque

[![Publish npm](https://github.com/lee1409/gatsby-source-yuque/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/lee1409/gatsby-source-yuque/actions/workflows/npm-publish.yml)
[![npm version](https://badge.fury.io/js/%40techberg%2Fgatsby-source-yuque.svg)](https://badge.fury.io/js/%40techberg%2Fgatsby-source-yuque)

This plugins is used to fetch yuque documents into gatsby.

## Installation

Install the repo

`yarn add @techberg/gatsby-source-yuque` 


Look for the namespace you want to pull. [Read this](https://www.yuque.com/yuque/developer/repo) to 
find out how to get your namespace

```js
plugins: [
  {
    resolve: 'gatsby-source-yuque',
    options: {
        token: '<YOUR TOKEN>',
        namespace: '<YOUR NAMESPACE>',
        timeout: 20000 // Optional: default for request timeout is 20000
    }
  }
]
```

## How to query

#### Yuque Documents

```graphql
{
  allYuqueDoc {
    edges {
      node {
        id
        last_editor {
          id
        }
        custom_description
        yuqueId
        book {
          id
        }
      }
    }
  }
}
```

#### Yuque Documents Detail

```graphql
{
  allYuqueDocDetail {
    edges {
      node {
        id
        _serializer
        body
        ...
        creator {
          id
          avatar_url
          name
          ...
        }
        book {
          id
          name
          ...
        }
      }
    }
  }
}
```

## FAQ

### Connection Timeout

If you face `ConnectionTimeoutError: Connect timeout for 1000ms...` problem, 
try to extend the timeout.