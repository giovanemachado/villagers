import { UnitsService } from '../units.service';
import { StaticDataService } from '../../static-data/static-data.service';

describe('UnitsService', () => {
  let staticDataService: StaticDataService;
  let unitsService: UnitsService;

  beforeEach(() => {
    staticDataService = new StaticDataService();
    unitsService = new UnitsService(staticDataService);
  });

  it.todo('wait and trust');
});
