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

    static async getHintsForGame(gameId) {
        return await fetch(`${SERVER_URL}/get-hints-for-game/${gameId}`)
            .then(res => res.json())
            .catch(err => console.log(err));
    }

    static async deleteHint(id) {
        return await fetch(`${SERVER_URL}/delete-hint/${id}`, {
            method: 'DELETE'
        })
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

    static async getGame(id) {
        return await fetch(`${SERVER_URL}/get-game/${id}`)
            .then(res => res.json())
            .catch(err => console.log(err));
    }

    static async getAllGames() {
        return await fetch(`${SERVER_URL}/get-all-games`)
            .then(res => res.json())
            .catch(err => console.log(err));
    }

    static async deleteGame(id) {
        return await fetch(`${SERVER_URL}/delete-game/${id}`, {
            method: 'DELETE'
        })
            .then(res => res.json())
            .catch(err => console.log(err));
    }
}

export default ServerFacade;