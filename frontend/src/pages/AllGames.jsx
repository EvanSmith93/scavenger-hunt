import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import ServerFacade from '../serverFacade/ServerFacade';
import GameCard from './GameCard';


const AllGames = () => {
    const [games, setGames] = useState([]);
    const [error, setError] = useState(false);

    const [newName, setNewName] = useState('');

    const addGame = async (name) => {
        const newGameJson = {name: name};

        const response = await ServerFacade.addGame(newGameJson);
        setGames(prevGames => [...prevGames, {name: name, id: response.id}]);
        
        setNewName('');
    };

    useEffect(() => {
        const fetchGames = async () => {
            const res = await ServerFacade.getAllGames();
            
            if (res.ok) {
                setGames(res.body);
            } else {
                setError(true);
            }
        };
        fetchGames();
    }, []);

    return ( 
        <div className="all-games">
            <h1>All Games</h1>
            {error && <div>Error</div>}
            {!error && !games && <div>Loading...</div>}
            {!error && games && (
                games.map((game, index) => (
                    <GameCard game={game} key={index} />
                ))
            )}

            <div className="mt-3">
            <input
                type="text"
                className="form-control w-25 mx-auto"
                placeholder="Enter game name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
            />
            <button
                className="btn btn-primary mt-2"
                onClick={() => addGame(newName)}
                disabled={!newName}
            >
                Add Game
            </button>
            </div>

            {/* <div className="container mt-5">
                <h2>Add Game</h2>
                <form id="addGameForm" className="mx-auto w-50" onSubmit={addGame}>
                    <div className="form-group py-3">
                    <label htmlFor="nameSubmit">Name</label>
                    <input type="text" className="form-control form-control-md" id="nameSubmit" name="nameSubmit" value={newName} onChange={(e) => setNewName(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-primary">Add Game</button>
                </form>
            </div> */}
        </div>
     );
}
 
export default AllGames;