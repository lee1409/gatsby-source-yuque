# Gatsby source yuque

This plugins is used to fetch yuque documents into gatsby. The work is still under development


## To use it

First of all, you need to install the repo

`yarn add @techberg/gatsby-source-yuque` 


Look for the namespace you want to pull. [Read this](https://www.yuque.com/yuque/developer/repo) to find out how to get your namespace

```
plugins: [
  {
    resolve: 'gatsby-source-yuque',
    options: {
        token: <YOUR TOKEN>,
        namespace: <YOUR NAMESPACE>
    }
  }
]
```
