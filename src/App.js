import React from 'react';
import SearchBox from './SearchBox';
import './styles.css';

const App = () => {
  return (
    <div className="container">
      <h1>Diário Oficial da União</h1>
      <SearchBox />
    </div>
  );
};

export default App;