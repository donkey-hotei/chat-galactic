export const PEER_JOINED = 'PEER_JOINED';
export const PEER_EXITED = 'PEER_EXITED';
export const UPDATE_CONVERSATION = 'UPDATE_CONVERSATION';

export const peerJoined = peer => (
  {
    type: PEER_JOINED,
    peer,
  }
);

export const peerExited = peer => (
  {
    type: PEER_EXITED,
    peer,
  }
);

export const updateConversation = message => (
  {
    type: UPDATE_CONVERSATION,
    message,
  }
);
