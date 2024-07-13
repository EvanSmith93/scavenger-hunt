import React, { useState, useEffect } from "react";
import ServerFacade from "../serverFacade/ServerFacade";
import { Button, Card, Form, Input, List, Typography } from "antd";
import { useForm } from "antd/es/form/Form";
import { Link } from "react-router-dom";

const GameCard = ({ game }) => {
    const [hints, setHints] = useState([]);
    const [error, setError] = useState(false);

    const [form] = useForm();

    async function addHint(values) {
        const newHintJson = { hint: values.hint, gameId: game.id };
        const res = await ServerFacade.addHint(newHintJson);
        setHints((prevHints) => [
            ...prevHints,
            { hint: values.hint, id: res.id },
        ]);

        form.resetFields();
    }

    useEffect(() => {
        const fetchHints = async () => {
            const res = await ServerFacade.getHintsForGame(game.id);

            if (res.ok) {
                setHints(res.body);
            } else {
                setError(true);
            }
        };
        fetchHints();
    }, [game.id]);

    return (
        <Card title={game.name}>
            {error && <div>Error</div>}
            {!error && !hints && <div>Loading...</div>}

            <List>
                {hints.map((hint, index) => (
                    <List.Item key={index}>
                        <Typography.Text>{hint.hint}</Typography.Text>
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
        </Card>
    );
};

export default GameCard;
