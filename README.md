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

schema.yaml is updated by any yarn start command. This is done by Nest JS CLI + Swagger plugin (OpenAPI plugin). The data convertion done in
schema.ts uses https://github.com/drwpow/openapi-typescript/tree/main/packages/openapi-typescript

```bash
# It triggers cli to build the new schema.yaml
$ yarn start

# It gets data from open api and build a file in ./src/open-api/schema.ts, this can be copy and paste into castle_age
$ yarn g-schema
```

### Tricks

You can grab player id and username this way in any controller

```ts
@Post('/any-route')
anyMethod(@Req() { player }: { player: PlayerData }) {
    console.log(player.id, player.username)
}
```
