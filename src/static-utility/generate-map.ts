import { SquareData } from 'src/maps/types/square-data.type';
import * as fs from 'fs';
import { initial_map_definition } from './definitions/initial-map';
import { SquareDefinitionData } from './types/square-data-definition.type';
import { SQUARE_TYPES } from './types/square-types.enum';
import { MAPS } from './types/maps.enum';
import {
  UNIT_CATEGORY,
  UNIT_CLASS,
  UnitData,
} from 'src/units/types/unit-data.type';

const mapDefinitions = [MAPS.INITIAL];
let inputMapDefinition = '';
const squareIdTag = 'square-';
const address = './static_data/maps/map';
const format = 'json';
let unitCount = 0;

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

const createUnit = (unitDefinition: UNIT_CLASS): UnitData => {
  let unitTag: UNIT_CLASS = UNIT_CLASS.ARCHER;
  let unitCategory: UNIT_CATEGORY = UNIT_CATEGORY.MILITARY;

  switch (unitDefinition) {
    case UNIT_CLASS.ARCHER:
      unitTag = UNIT_CLASS.ARCHER;
      unitCategory = UNIT_CATEGORY.MILITARY;
      break;
    case UNIT_CLASS.HORSEMAN:
      unitTag = UNIT_CLASS.HORSEMAN;
      unitCategory = UNIT_CATEGORY.MILITARY;
      break;
    case UNIT_CLASS.SPEARMAN:
      unitTag = UNIT_CLASS.SPEARMAN;
      unitCategory = UNIT_CATEGORY.MILITARY;
      break;
    case UNIT_CLASS.CASTLE:
      unitTag = UNIT_CLASS.CASTLE;
      unitCategory = UNIT_CATEGORY.STRUCTURE;
      break;
    case UNIT_CLASS.WALL:
      unitTag = UNIT_CLASS.WALL;
      unitCategory = UNIT_CATEGORY.STRUCTURE;
      break;
    case UNIT_CLASS.GATE:
      unitTag = UNIT_CLASS.GATE;
      unitCategory = UNIT_CATEGORY.STRUCTURE;
      break;
  }

  let unit: UnitData = {
    id: `${unitTag}-${unitCount}`,
    class: unitTag,
    category: unitCategory,
  };

  unitCount++;
  return unit;
};

const generateMap = (inputMapDefinition: string) => {
  let map_definition: SquareDefinitionData[][] | null = null;

  switch (inputMapDefinition) {
    case MAPS.INITIAL:
      map_definition = initial_map_definition;
      break;
  }

  if (inputMapDefinition == 'MAPS.INITIAL') {
    map_definition = initial_map_definition;
  }

  if (!map_definition) {
    console.log('Invalid map definition');
    process.exit();
  }

  let rows: SquareData[][] = [];

  map_definition.map((rows_definition, indexRows) => {
    let squares: SquareData[] = [];

    rows_definition.map((row_definition, indexRow) => {
      let id = squareIdTag + (indexRows * 10 + indexRow);
      let type = row_definition.type ? row_definition.type : SQUARE_TYPES.GRASS;

      let unit: UnitData | undefined = undefined;

      if (row_definition.unitDefinitionClass) {
        unit = createUnit(row_definition.unitDefinitionClass);
      }

      squares.push({ id, type, unit });
    });

    rows.push(squares);
  });

  return rows;
};

let result = generateMap(inputMapDefinition);

fs.writeFileSync(
  `${address}-${new Date().getTime()}.${format}`,
  JSON.stringify(result),
);
