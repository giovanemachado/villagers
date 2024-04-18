import { MapData } from '../types/map-data.type';

const initialData: MapData = {
  units: [
    { id: 'card-1' },
    { id: 'card-2' },
    { id: 'card-3' },
    { id: 'card-4' },
  ],
  rows: [
    [
      {
        id: 'square-1',
        type: 'grass',
        unitIds: [],
      },
      {
        id: 'square-2',
        type: 'grass',
        unitIds: [],
      },
      {
        id: 'square-3',
        type: 'water',
        unitIds: ['unit-1'],
      },
    ],
    [
      {
        id: 'square-4',
        type: 'water',
        unitIds: [],
      },
      {
        id: 'square-5',
        type: 'grass',
        unitIds: [],
      },
    ],
    [
      {
        id: 'square-6',
        type: 'grass',
        unitIds: [],
      },
      {
        id: 'square-7',
        type: 'grass',
        unitIds: [],
      },
      {
        id: 'square-8',
        type: 'water',
        unitIds: ['unit-2'],
      },
    ],
    [
      {
        id: 'square-9',
        type: 'grass',
        unitIds: [],
      },
      {
        id: 'square-10',
        type: 'grass',
        unitIds: [],
      },
      {
        id: 'square-11',
        type: 'water',
        unitIds: [],
      },
    ],
  ],
};

export default initialData;
