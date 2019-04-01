import gql from 'graphql-tag';

export const ENDTIME_QUERY = gameStateID => gql`
  subscription {
    endTimeUpdated(gameStateID: "${gameStateID}")
  }
`;

export const CHARACTER_UPDATED_QUERY = gameStateID => gql`
  subscription {
    characterUpdated(
      gameStateID: "${gameStateID}",
    ) {
      colour
      coordinates {
        x
        y
      }
      locked
      itemClaimed
      characterEscaped
    }
  }
`;

export const MAZETILE_UPDATED_QUERY = gameStateID => gql`
  subscription {
    mazeTileAdded(gameStateID: "${gameStateID}") {
      spriteID
      orientation
      cornerCoordinates {
        x
        y
      }
    }
  }
`;

export const ITEMS_CLAIMED_QUERY = gameStateID => gql`
  subscription {
    allItemsClaimed(gameStateID: "${gameStateID}")
  }
`;

export const END_GAME_QUERY = gameStateID => gql`
  subscription {
    endGame(gameStateID: "${gameStateID}")
  }
`;

export const LOBBY_UPDATED_QUERY = gql`
  subscription {
    lobbiesUpdated {
      _id
      users {
        uid
        username
      }
    }
  }
`;

export const LOBBY_USERS_UPDATED_QUERY = lobbyID => gql`
  subscription {
    lobbyUsersUpdated(lobbyID: "${lobbyID}") {
      _id
      users {
        uid
        username
      }
    }
  }
`;

export const CREATED_GAMESTATE_QUERY = lobbyID => gql`
  subscription {
    createdGameState(lobbyID: "${lobbyID}")
  }
`;
