# nice-registry

A proxy to the npm registry that serves fancied up package metadata.

## Installation

```sh
npm install nice-registry --save
```

## Tests

```sh
npm install
npm test
```

## Dependencies

- [express](https://github.com/expressjs/express): Fast, unopinionated, minimalist web framework
- [fs-extra](https://github.com/jprichardson/node-fs-extra): fs-extra contains methods that aren&#39;t included in the vanilla Node.js fs package. Such as mkdir -p, cp -r, and rm -rf.
- [human-interval](https://github.com/rschmukler/human-interval): Human readable time measurements
- [isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch): Isomorphic WHATWG Fetch API, for Node &amp; Browserify
- [lodash](https://github.com/lodash/lodash): Lodash modular utilities.
- [mkdirp](https://github.com/substack/node-mkdirp): Recursively mkdir, like `mkdir -p`
- [nice-package](https://github.com/zeke/nice-package): Clean up messy package metadata from the npm registry
- [registry-url](https://github.com/sindresorhus/registry-url): Get the set npm registry URL
- [serve-favicon](https://github.com/expressjs/serve-favicon): favicon serving middleware with caching

## Dev Dependencies

- [chai](https://github.com/chaijs/chai): BDD/TDD assertion library for node.js and the browser. Test framework agnostic.
- [dependent-packages](https://github.com/zeke/dependent-packages): Offline collection of the dependents and devDependents of every package in the npm registry.
- [mocha](https://github.com/mochajs/mocha): simple, flexible, fun test framework
- [standard](https://github.com/feross/standard): JavaScript Standard Style
- [supertest](https://github.com/visionmedia/supertest): SuperAgent driven library for testing HTTP servers


## License

MIT
