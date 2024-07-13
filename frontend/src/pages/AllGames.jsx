import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ServerFacade from "../serverFacade/ServerFacade";
import GameCard from "./GameCard";
import { Button, Flex, Form, Input, Layout, Space, Typography } from "antd";

const AllGames = () => {
    const [games, setGames] = useState([]);
    const [error, setError] = useState(false);

    const [form] = Form.useForm();

    async function addGame(values) {
        const newGameJson = { name: values.name };

        const response = await ServerFacade.addGame(newGameJson);
        setGames((prevGames) => [
            ...prevGames,
            { name: values.name, id: response.id },
        ]);

        form.resetFields();
    }

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
        <Space direction="vertical" size="middle" style={{ padding: "20px" }}>
            <Typography.Title>All Games</Typography.Title>

            {error && <div>Error</div>}
            {!error && !games && <div>Loading...</div>}

            <Flex wrap gap="middle">
                {!error &&
                    games &&
                    games.map((game, index) => (
                        <GameCard game={game} key={index} />
                    ))}
            </Flex>

            <Form form={form} onFinish={addGame}>
                <Form.Item
                    name="name"
                    label="Name"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        className="float-right"
                        onClick={form.submit}
                    >
                        Add Game
                    </Button>
                </Form.Item>
            </Form>

            {/* <input
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
            </button> */}

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
        </Space>
    );
};

export default AllGames;
