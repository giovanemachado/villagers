import { SquareData } from 'src/maps/dto/square-data.dto';
import * as fs from 'fs';
import { initial_map_definition } from './definitions/initial-map';
import { SquareDefinitionData } from './types/square-data-definition.type';
import { SQUARE_TYPES } from './types/square-types.enum';
import { MAPS } from './types/maps.enum';
import { UNIT_CLASS, UnitData } from 'src/units/dto/unit-data.dto';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { UnitsService } from 'src/units/units.service';

const mapDefinitions = [MAPS.INITIAL];
let inputMapDefinition = '';
const squareIdTag = 'square-';
const address = './static_data/maps/map';
const format = 'json';
let unitCount = 0;
let squareCount = 0;

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

const generateUnitId = (unitTag: UNIT_CLASS) => {
  const unitId = `${unitTag}-${unitCount}`;
  unitCount++;
  return unitId;
};
const generateSquareId = () => {
  const squareId = squareIdTag + squareCount;
  squareCount++;
  return squareId;
};

const generateMap = (inputMapDefinition: string, unitService: UnitsService) => {
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

  const rows: SquareData[][] = [];

  map_definition.map((rows_definition) => {
    const squares: SquareData[] = [];

    rows_definition.map((row_definition) => {
      const id = generateSquareId();
      const type = row_definition.type
        ? row_definition.type
        : SQUARE_TYPES.GRASS;

      let unit: UnitData | undefined = undefined;

      if (row_definition.unitDefinitionClass) {
        unit = unitService.generateStaticUnit(
          row_definition.unitDefinitionClass,
        );
        unit.id = generateUnitId(unit.class);
      }

      squares.push({ id, type, unit });
    });

    rows.push(squares);
  });

  return rows;
};

const showStructure = (generatedMap: SquareData[][]): string => {
  let rowsData = `
  
  `;

  generatedMap.forEach((row) => {
    let squareData = '';

    row.forEach((square) => {
      let unit = '';

      if (square.unit) {
        unit = square.unit.class;
      }

      squareData += ` [${unit}] `;
    });

    rowsData += `
      ${squareData}
    `;
  });

  return rowsData;
};

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const unitService = app.get(UnitsService);

  const generatedMap = generateMap(inputMapDefinition, unitService);

  const fileName = `${address}-${new Date().getTime()}.${format}`;

  fs.writeFileSync(fileName, JSON.stringify(generatedMap));

  // fs.appendFileSync(fileName, showStructure(generatedMap));

  await app.close();
}

bootstrap();

// Example from showStructure()
// []  []  []  []  []

// [spearman]  [castle]  [spearman]  []  []

// [wall]  [wall]  [gate]  [wall]  [gate]

// []  []  []  []  []

// []  []  []  []  []

// []  []  []  []  []

// [wall]  [wall]  [gate]  [wall]  [gate]

// [spearman]  [castle]  [spearman]  []  []

// []  []  []  []  []
