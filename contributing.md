# Contributing

:sparkle: Thanks for taking the time to contribute :sparkle:

## Development

Run the server:

```sh
npm install
npm start
```

Run the tests:

```sh
npm install
npm test
```

Run the tests or server with debug messages enabled:

```sh
DEBUG=1 npm test
DEBUG=1 npm start
```

## Hosting

There's an instance running on Digital Ocean at `registry.npmhub.org`

The server was configured using these guides:

- https://www.digitalocean.com/products/one-click-apps/node-js/
- https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-16-04
- https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04


Example queries:

- https://registry.npmhub.org/package/express
- https://registry.npmhub.org/packages?names=express,lodash&pick=name,description
