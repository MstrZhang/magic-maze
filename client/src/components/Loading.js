import React from 'react';
import { Spinner } from 'reactstrap';

const Loading = () => (
  <div>
    <div className="cover">
      <div className="container" style={{ marginTop: '15em' }}>
        <header>
          <h1>LOADING</h1>
        </header>
        <div style={{ textAlign: 'center', marginTop: '5em' }}>
          <Spinner color="success" style={{ width: '15em', height: '15em', fontWeight: 'bold' }} />
        </div>
      </div>
    </div>
  </div>
);

export default Loading;
