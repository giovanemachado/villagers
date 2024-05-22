## Documentation

Compilation of tips and tricks for this project.

Backed by: [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.
Supabase as database (postgress), with Prisma.

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

### Other scripts

```bash
# call generate-map.js to build maps from definitions (see details in Generate maps section)
$ yarn g-map

# generates the schema.yaml file (see details in Generate type schema section)
$ yarn g-schema

# generates enums to our schema file (see details in Generate type schema section)
$ yarn g-enum

# prisma alias for generating types
$ yarn p-generate

# prisma alias for model changes
$ yarn p-migrate


# prisma alias for seeding
$ yarn p-seed

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

You can grab player id (from payload) this way in any controller

```ts
@Post('/any-route')
anyMethod(@Req() { player }: { player: PlayerData }) {
    console.log(player.id)
}
```

## Game actions to backend flow.

Player 1: Whoever creates a Match.
Player 2: The player invited to this Match.

### 1 - Login

Login and Auth in the frontend is all in suppabase. This repo has a guard (see src/auth) though.

### 2 - Create a Match

Player 1 creates a Match, and get a code (6 digits) to share (this is how you invite someone now). This is done in `@Post('/match')`. This generates the Match data. Frontend is updated with the response, then waits an event via websocket to update again.

### 3 - Enter in a Match

Player 2, with the code in hands, can Enter in a Match. This is done in `@Post('/enter-match/:code')`. This will update Match data and creates a MatchState. Player 2's frontend is updated with the response, and emit an event that updates Player 1's frontend.

### 4 - (Not an action) Get initial data

With Match and MatchState ready to start, and both Players ready to play, the initial load can be done. Map, Units (the start Units) and the current MatchState will be retrieved and the map can be built. This is done via `@Get('/map/:code')`. This is static data.

### 5 - Pass turns

Both players can now interact with their Units, and then Pass the turn. This is done in `@Post('/match-state/:code')`. They will send a piece of the state, showing what they did, and receive an ok. Backend will wait for both players, then emit an event to update both frontends with the end results.

### Reconnect

If a player disconnect, he can enter the game again. His frontend will need to do 4 again, and he might lost the current (and not persisted yet) turn actions.
