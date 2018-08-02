import React from 'react';
import PropTypes from 'prop-types';
import './PeerEntry.css';

const PeerEntry = ({ peer }) => (
  <li>
    <div className="peer-entry">
      { peer.name }
    </div>
  </li>
);

PeerEntry.propTypes = {
  peer: PropTypes.shape({
    id: PropTypes.number,
    username: PropTypes.string,
  }).isRequired,
};

export default PeerEntry;
