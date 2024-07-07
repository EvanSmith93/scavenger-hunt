import React, { useState, useEffect } from 'react';
import ServerFacade from '../serverFacade/ServerFacade';

const GameCard = ({ game }) => {
    const [hints, setHints] = useState([]);
    const [error, setError] = useState(false);

    const [newHint, setNewHint] = useState('');

    const addHint = async (gameId) => {
        const newHintJson = { hint: newHint, gameId: gameId };
        const res = await ServerFacade.addHint(newHintJson);
        console.log(res);
        setHints((prevHints) => [...prevHints, newHint + " -- " + res.body]);

        setNewHint('');
    };

    useEffect(() => {
        const fetchHints = async () => {
            const res = await ServerFacade.getHintsForGame(game.id);

            if (res.ok) {
                setHints(res.body.map((hint) => hint.hint + ' -- ' + hint.id));
            } else {
                setError(true);
            }
        };
        fetchHints();
    }, []);

    return ( 
        <div className="card mx-auto w-50 m-3">
            <div className="card-body">
                <h5 className="card-title">{game.name}</h5>

                {/* List of Hints */}
                {error && <div>Error</div>}
                {!error && !hints && <div>Loading...</div>}
                {!error && hints && (
                    <ul className="list-group mt-3">
                    {hints.map((hint, index) => (
                        <li className="list-group-item" key={index}>
                            {hint}
                        </li>
                        ))}
                    </ul>
                )}

                {/* Add Hint Form */}
                <div className="mt-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Enter hint description"
                    value={newHint}
                    onChange={(e) => setNewHint(e.target.value)}
                />
                <button
                    className="btn btn-primary mt-2"
                    onClick={() => addHint(game.id)}
                    disabled={!newHint}
                >
                    Add Hint
                </button>
                </div>
            </div>
            </div>
     );
}
 
export default GameCard;