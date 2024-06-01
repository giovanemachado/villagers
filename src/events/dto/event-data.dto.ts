export enum EVENT_TYPES {
  JOIN_MATCH = 'enter_in_match', // When player 2 enters in the match
  BOTH_PLAYERS_ENDED_TURN = 'both_players_ended_turn', // When both players hit pass turn and match state is updated in the backend
  FINISH_MATCH = 'match_finished', // When any of the players ends the match
}
