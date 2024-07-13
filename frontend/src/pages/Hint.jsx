import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NotFound from "./404.jsx";
import ServerFacade from "../serverFacade/ServerFacade.js";
import { Card, Layout, Space, Typography } from "antd";
import Cookies from "js-cookie";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const Hint = () => {
    const { id } = useParams();
    const [hint, setHint] = useState(null);
    const [hintCount, setHintCount] = useState(null);
    const [hintsFound, setHintsFound] = useState([]);
    const [isNewHint, setIsNewHint] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        function handleCookies(gameId) {
            let found = JSON.parse(Cookies.get(`hints-game-${gameId}`) || "[]");
            if (!found.includes(id)) {
                found.push(id);
                Cookies.set(`hints-game-${gameId}`, JSON.stringify(found));
                setIsNewHint(true);
            }
            setHintsFound(found);
        }

        async function fetch() {
            const hintRes = await ServerFacade.getHint(id);

            if (hintRes.ok) {
                const countRes = await ServerFacade.getHintCount(
                    hintRes.body.gameId
                );

                if (countRes.ok) {
                    setHint(hintRes.body);
                    setHintCount(countRes.body);
                    handleCookies(hintRes.body.gameId);
                } else {
                    setError(true);
                }
            } else {
                setError(true);
            }
        }
        fetch();
    }, [id]);

    const icons = [];
    for (let i = 0; i < hintCount; i++) {
        if (i < hintsFound.length) {
            icons.push(
                <CheckCircleOutlined key={i} style={{ color: "green" }} />
            );
        } else {
            icons.push(
                <CloseCircleOutlined key={i} style={{ color: "grey" }} />
            );
        }
    }

    return (
        <>
            {error ? (
                <NotFound />
            ) : (
                <Layout style={{ padding: "20px", minHeight: "100vh" }}>
                    <Typography.Title>
                        {hintCount && hintsFound.length >= hintCount
                            ? "You found all the hints!"
                            : isNewHint
                            ? "You found a new hint!"
                            : "Hint"}
                    </Typography.Title>
                    <Card>
                        {!hint ? (
                            <div>Loading...</div>
                        ) : (
                            <>
                                <Space style={{ fontSize: "30px" }}>
                                    {icons}
                                </Space>
                                <Typography.Title level={5}>
                                    Game ID: {hint.gameId}
                                </Typography.Title>
                                <Typography.Title level={5}>
                                    Hint: {hint.hint}
                                </Typography.Title>
                            </>
                        )}
                    </Card>
                </Layout>
            )}
        </>
    );
};

export default Hint;
