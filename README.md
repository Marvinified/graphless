# Graphless

GraphQL Framework for Serverless that helps you quickly get started develoing GraphQL Serverless API's with minimal configuration.

# Getting Started

- Installation of the `@graphless/cli`.

  ```sh
   npm -g @graphless/cli
  ```

  The CLI can be used to Bootstrap a new project, generate a new GraphQL Function, Run the development server and more

- Starting a new Graphless Project.

  ```
  graphless init AwesomeProject
  ```

  After running this, you will be provided with a prompt so that you can choose the your cloud provider.

  ```shell
  ? Choose your cloud provider? (Use arrow keys)
  ❯ Google Cloud Functions
  - Azure - In Development (Disabled)
  - Lambda - In Development (Disabled)
  ```

  #### Note: Only `Google Cloud Functions` is supported at the moment. Support for `Azure and Lambda` are still in development. Contributions are highly welcomed.

  Once your project is setup you should see the following

  ```
  ✔︎ Success! Created AwesomeProject

  You can run the following command to get started!

  $ cd AwesomeProject
  $ yarn serve
  ```

  - Start Development Server

    ```
    yarn serve
    ```

    This will spin up the GQL functions and a GQL Gateway to interface with the functions.

    The functions will be available at `localhost:8081` to `localhost:808[N]`, where `N = 1 - Number of functions`

    The GQL gateway will be available at: [localhost:8080](localhost:8080).

# Concept and Introduction

Graphless is aimed to help you get started fast developing graphql API's on Cloud Serverless Functions.

The basic structure of a Graphless Project consist:

- A `graphless.yml` config file that handle all project configuration.

  - Sets the Cloud provider.
  - Specify available GQL functions.
  - Sets the development server ports

  ```yml
  app:
    provider: gcloud
    dev:
      port: 8080
    graphs:
      users:
        path: /src/graphql/users
      posts:
        path: /src/graphql/posts
  ```

- A `app.js` file which serves as the entry point to the project.

  ```js
  //This is a gcloud project example
  const { registerGraphFunctions } = require("@graphless/gcloud");
  const app = registerGraphFunctions();
  module.exports = app;
  ```

  `registerGraphFunctions` registers all the available GQL Functions listed in the `graphless.yml` file and automatically setup a `gateway` along side.

- The `Graphql functions` which are in the `src/graphql` folder (this is the default folder for the fuction, though they can be placed anywhere)

  - Let's take a look at the users gql function in `src/graphql/users/index.js`

    ```js
    const {
      ApolloServer,
      gql,
      buildFederatedSchema,
    } = require("@graphless/gcloud");

    // Construct a schema, using GraphQL schema language
    const typeDefs = gql`
      type Query {
        posts: String
      }
    `;

    // Provide resolver functions for your schema fields
    const resolvers = {
      Query: {
        posts: () => "Hello Posts!",
      },
    };

    // setup function server
    const server = new ApolloServer({
      schema: buildFederatedSchema([
        {
          typeDefs,
          resolvers,
        },
      ]),
      playground: true,
      introspection: true,
    });

    module.exports = server.createHandler();
    ```


    ### From this point everything is same with the regular GQL Projects.

- ## Generating a new Graphless Function

  lets say we want to add a new graphless function for `notifications`

  ```
  graphless generate graphql/notifications
  ```

  this will spin up a new function in `src/graphql/notifications/index.js` and register it in the `graphless.yml`

  ```js
  const {
    ApolloServer,
    gql,
    buildFederatedSchema,
  } = require("@graphless/gcloud");

  // Construct a schema, using GraphQL schema language
  const typeDefs = gql`
    type Query {
      posts: String
    }
  `;

  // Provide resolver functions for your schema fields
  const resolvers = {
    Query: {
      posts: () => "Hello Posts!",
    },
  };

  // setup function server
  const server = new ApolloServer({
    schema: buildFederatedSchema([
      {
        typeDefs,
        resolvers,
      },
    ]),
    playground: true,
    introspection: true,
  });

  module.exports = server.createHandler();
  ```

- ## Deploying Graphless Functions.

  Currently to avoid unneccessary complexity with deployment a graphless project doesn't need anything special configuration to be deployed.

  Deployment follows the generic process of deployment as specified by the cloud proovider of choice.

  *_NOTE: We might eventually create a cli utility to help with deployment and give a uniform process accross different cloud providers BUT just not yet._*

  - ### Deploying a Graphless Project that is setup using `Google Cloud Function` as the Cloud Provider:

    - Deploy each functions seperately as specified in the `graphless.yml`
      ```bash
      gcloud functions deploy users --runtime nodejs12  --trigger-http --allow-unauthenticated
      ```
    - Then if you need the gateway then deploy as follows

        - First specify your Base cloud URL for your functions in `.env.yml`

            ```env
            CLOUD_URL: "https://us-central1-xxxx-xxxx.cloudfunctions.net"
            ```
        - Then deploy the `gateway` that has been automatically created by graphless framework.

            ```bash
            gcloud functions deploy gateway --runtime nodejs12  --trigger-http --allow-unauthenticated
            ```

- ## Contributions
  Feel free to create a PR!
