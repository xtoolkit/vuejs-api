# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [2.0.1](https://github.com/xtoolkit/vuejs-api/compare/v1.1.5...v2.0.1) (2021-01-09)

- forget build :(

## [2.0.0](https://github.com/xtoolkit/vuejs-api/compare/v1.1.5...v2.0.0) (2021-01-09)

### Bold changes:

- refactor
  - rollup: change bable to buble
  - add more events like up/download progress
  - in v1 we echo all Xetch class to reactive data. now reactive only res data
  - new pagination
  - new unReactive method
  - recode for remove all pollyfill files like remove all async function and echo promise function
- support composation api
- add unit test
- add use other graphql endpoint

### Breaking changes:

1. $api.request -> $api.promise
2. pagination: Object -> pagination: boolean
3. in methods: this.ctx -> this.app

### [1.1.5](https://github.com/xtoolkit/vuejs-api/compare/v1.1.4...v1.1.5) (2020-11-26)

### [1.1.4](https://github.com/xtoolkit/vuejs-api/compare/v1.1.3...v1.1.4) (2020-11-26)

### [1.1.3](https://github.com/xtoolkit/vuejs-api/compare/v1.1.2...v1.1.3) (2020-11-25)

### [1.1.2](https://github.com/xtoolkit/vuejs-api/compare/v1.1.1...v1.1.2) (2020-11-25)

### [1.1.1](https://github.com/xtoolkit/vuejs-api/compare/v1.1.0...v1.1.1) (2020-11-25)

## [1.1.0](https://github.com/xtoolkit/vuejs-api/compare/v1.0.0...v1.1.0) (2020-10-16)

## [1.0.0](https://github.com/xtoolkit/vuejs-api/compare/v0.1.15...v1.0.0) (2020-10-15)

initial release!
