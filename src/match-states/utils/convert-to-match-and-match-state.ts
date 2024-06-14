import { ERROR_MESSAGE } from 'src/errors/messages';
import { MatchState } from '../dto/match-state.dto';
import { MatchAndMatchState } from '../types/match-and-match-state.type';
import { UnprocessableEntityException } from '@nestjs/common';

export const convertToMatchAndMatchState = (m: any): MatchAndMatchState => {
  if (!m.matchState || !hasMatchStateProperties(m.matchState)) {
    throw new UnprocessableEntityException(ERROR_MESSAGE.invalidMatchState);
  }

  return {
    ...m,
    matchState: m.matchState as MatchState,
  };
};

const hasMatchStateProperties = (obj: any): boolean => {
  const properties = Object.getOwnPropertyNames(obj);

  return (
    properties.includes('id') &&
    properties.includes('turns') &&
    properties.includes('playersEndTurn') &&
    properties.includes('unitsMovement') &&
    properties.includes('money')
  );
};
