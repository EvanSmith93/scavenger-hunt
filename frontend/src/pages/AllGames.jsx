import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ServerFacade from "../serverFacade/ServerFacade";
import { Button, Card, Form, Input, Layout, List, Typography } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

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

    async function deleteGame(id) {
        const response = await ServerFacade.deleteGame(id);
        if (response.ok) {
            setGames(games.filter((g) => g.id !== id));
        }
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
        <Layout style={{ padding: "20px", minHeight: "100vh" }}>
            <Typography.Title>All Games</Typography.Title>
            <Card>
                {error && <div>Error</div>}
                {!error && !games && <div>Loading...</div>}

                <List>
                    {!error &&
                        games &&
                        games.map((game, index) => (
                            <List.Item
                                key={index}
                                actions={[
                                    <Button
                                        onClick={() => deleteGame(game.id)}
                                        icon={<DeleteOutlined />}
                                        type="text"
                                        danger
                                    />,
                                ]}
                            >
                                <List.Item.Meta
                                    title={
                                        <Link to={`/game/${game.id}`}>
                                            {game.name}
                                        </Link>
                                    }
                                />
                            </List.Item>
                        ))}
                </List>

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
            </Card>
        </Layout>
    );
};

export default AllGames;
