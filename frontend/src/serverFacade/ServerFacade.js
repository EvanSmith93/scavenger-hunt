// a sample server facade

const SERVER_URL = 'http://localhost:3001';

class ServerFacade {
static async addHint(hint) {
        return await fetch(`${SERVER_URL}/add-hint`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(hint)
        })
            .then(res => res.json())
            .catch(err => console.log(err));
    }

    static async getHint(id) {
        return await fetch(`${SERVER_URL}/get-hint/${id}`)
            .then(res => res.json())
            .catch(err => console.log(err));
    }

    static async getAllHints() {
        return await fetch(`${SERVER_URL}/get-all-hints`)
            .then(res => res.json())
            .catch(err => console.log(err));
    }

    static async getHintsForGame(gameid) {
        return await fetch(`${SERVER_URL}/get-hints-for-game/${gameid}`)
            .then(res => res.json())
            .catch(err => console.log(err));
    }

    static async addGame(name) {
        return await fetch(`${SERVER_URL}/add-game`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(name)
        })
            .then(res => res.json())
            .catch(err => console.log(err));
    }

    static async getAllGames() {
        return await fetch(`${SERVER_URL}/get-all-games`)
            .then(res => res.json())
            .catch(err => console.log(err));
    }
}

export default ServerFacade;