import React from 'react';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';
import './Homepage.css';

const Homepage = (props) => {
  const { history } = props;

  return (
    <div className="cover">
      <div className="container" style={{ marginTop: '12%' }}>
        <header>
          <h1>MAGIC MAZE</h1>
          <div className="logo">
            <span role="img" aria-label="arrow">🏹</span>
            <span role="img" aria-label="sword">⚔️</span>
            <span role="img" aria-label="magic">🎩</span>
            <span role="img" aria-label="gun">🔫</span>
          </div>
        </header>
        <div className="row">
          <div className="col" style={{ textAlign: 'center' }}>
            <Button color="primary" size="lg">Find a Lobby</Button>
            <Button color="success" size="lg" className="ml-4" onClick={() => history.push('/board')}>Play Singleplayer</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

Homepage.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
};

export default Homepage;
