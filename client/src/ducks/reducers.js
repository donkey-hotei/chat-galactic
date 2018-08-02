import { combineReducers } from 'redux';
import {
  PEER_JOINED,
  PEER_EXITED,
  UPDATE_CONVERSATION,
} from './actions';

const peers = (state = [], action) => {
  const { peer } = action;
  switch (action.type) {
    case PEER_JOINED:
      return state.concat(peer);
    case PEER_EXITED:
      return state.filter(p => p.uuid !== peer.id);
    default:
      return state;
  }
};

const conversation = (state = [], action) => {
  switch (action.type) {
    case UPDATE_CONVERSATION:
      return state.concat(action.payload);
    default:
      return state;
  }
};

const reducer = combineReducers({ peers, conversation });
export default reducer;
