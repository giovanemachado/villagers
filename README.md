## Villagers

Backend for the Castle Age game.

Backed by: [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Generate maps

```bash
# Generate map by definition (initial-map is a definition)
$ yarn g-map initial-map
```

## Generate type schema

```bash
# It gets data from open api and build a file in ./src/open-api/schema.ts, this can be copy and paste into castle_age
$ yarn g-schema
```

Notes:
https://github.com/drwpow/openapi-typescript/tree/main/packages/openapi-typescript
