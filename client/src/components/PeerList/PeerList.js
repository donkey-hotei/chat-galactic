import React from 'react';
import PropTypes from 'prop-types';
import PeerEntry from './PeerEntry';
import './PeerList.css';

const PeerList = ({ peers }) => (
  <div className="peer-list">
    <ul>
      {
        peers.map(peer => (<PeerEntry key={peer.uuid} peer={peer} />))
      }
    </ul>
  </div>
);

PeerList.propTypes = {
  peers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default PeerList;
