import { PickType } from '@nestjs/mapped-types';
import { PlayerDataCreate } from './player-create.dto';

export class PlayerData extends PickType(PlayerDataCreate, [
  'id',
  'username',
]) {}
