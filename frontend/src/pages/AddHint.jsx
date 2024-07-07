import React, { useState, useEffect } from 'react';
import ServerFacade from '../serverFacade/ServerFacade';

function AddHint() {
  const [game, setGame] = useState('');
  const [hint, setHint] = useState('');

  const handleSubmit = async (e) => {
      e.preventDefault();

      // Send a POST request to the backend
      const response = await ServerFacade.addHint();
  };

  return (
    <div className="container mt-5">
      <h2>Add Hint</h2>
      <form id="addHintForm" className="mx-auto w-50" onSubmit={handleSubmit}>
        <div className="form-group py-3">
          <label htmlFor="gameSubmit">Game</label>
          <input type="text" className="form-control form-control-md" id="gameSubmit" name="gameSubmit" value={game} onChange={(e) => setGame(e.target.value)} />
        </div>
        <div className="form-group py-3">
          <label htmlFor="hintSubmit">Hint</label>
          <textarea type="text" className="form-control form-control-md" rows="4" id="hintSubmit" name="hintSubmit" value={hint} onChange={(e) => setHint(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}

export default AddHint;
