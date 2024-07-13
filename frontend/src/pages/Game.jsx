import React, { useState, useEffect } from "react";
import ServerFacade from "../serverFacade/ServerFacade";
import { Button, Form, Input, List, Space, Typography } from "antd";
import { useForm } from "antd/es/form/Form";
import { useParams } from "react-router-dom";
import NotFound from "./404";

const Game = () => {
    const { id } = useParams();

    const [game, setGame] = useState(null);
    const [hints, setHints] = useState([]);
    const [error, setError] = useState(false);

    const [form] = useForm();

    async function addHint(values) {
        const newHintJson = { hint: values.hint, gameId: id };
        const res = await ServerFacade.addHint(newHintJson);
        setHints((prevHints) => [
            ...prevHints,
            { hint: values.hint, id: res.body },
        ]);

        form.resetFields();
    }

    useEffect(() => {
        async function fetch() {
            const gameRes = await ServerFacade.getGame(id);
            const hinstRes = await ServerFacade.getHintsForGame(id);

            if (gameRes.ok && hinstRes.ok) {
                setGame(gameRes.body);
                setHints(hinstRes.body);
            } else {
                setError(true);
            }
        }
        fetch();
    }, [id]);

    return (
        <>
            {error ? (
                <NotFound />
            ) : (
                <>
                    {!game ? (
                        <div>Loading...</div>
                    ) : (
                        <Space direction="vertical" size="middle" style={{ padding: "20px" }}>
                            <Typography.Title>
                                {game.name}
                            </Typography.Title>

                            <List>
                                {hints.map((hint, index) => (
                                    <List.Item key={index}>
                                        <Typography.Text>
                                            {hint.hint}
                                        </Typography.Text>
                                        <Button
                                            type="link"
                                            onClick={() =>
                                                (window.location.href = `/hint/${hint.id}`)
                                            }
                                        >
                                            View Hint
                                        </Button>
                                    </List.Item>
                                ))}
                            </List>

                            <Form form={form} onFinish={addHint}>
                                <Form.Item
                                    name="hint"
                                    label="Hint"
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
                                        Add Hint
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Space>
                    )}
                </>
            )}
        </>
    );
};

export default Game;
