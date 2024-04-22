import { SquareData } from 'src/maps/types/square-data.type';
import * as fs from 'fs';
import { initial_map_definition } from './definitions/initial-map';
import { SquareDefinitionData } from './types/square-data-definition.type';
import { MAPS } from './types/maps.enum';
import { SQUARE_TYPES } from './types/square-types.enum';

const mapDefinitions = [MAPS.INITIAL];
let inputMapDefinition = '';
const squareIdTag = 'square-';
const address = './static_data/maps/map';
const format = 'json';

process.argv.forEach(function (val, index) {
  if (index == 2) {
    if (val) {
      inputMapDefinition = val;
    }
  }
});

if (
  inputMapDefinition &&
  !mapDefinitions.includes(inputMapDefinition as MAPS)
) {
  console.log('No map definition.');
  process.exit();
}

function generateMap(inputMapDefinition: string) {
  let map_definition: SquareDefinitionData[][] | null = null;

  switch (inputMapDefinition) {
    case MAPS.INITIAL:
      map_definition = initial_map_definition;
  }

  if (!map_definition) {
    console.log('Invalid map definition');
    process.exit();
  }

  var rows: SquareData[][] = [];

  map_definition.map((rows_definition, indexRows) => {
    var squares: SquareData[] = [];

    rows_definition.map((row_definition, indexRow) => {
      var id = squareIdTag + (indexRows * 10 + indexRow);
      var type = row_definition.type ? row_definition.type : SQUARE_TYPES.GRASS;
      var unitIds = row_definition.unitDefinitionIds
        ? row_definition.unitDefinitionIds
        : [];

      squares.push({ id, type, unitIds });
    });

    rows.push(squares);
  });

  return rows;
}

var result = generateMap(inputMapDefinition);

fs.writeFileSync(
  `${address}-${new Date().getTime()}.${format}`,
  JSON.stringify(result),
);
