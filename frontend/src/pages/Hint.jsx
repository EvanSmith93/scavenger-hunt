import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NotFound from "./404.jsx";
import ServerFacade from "../serverFacade/ServerFacade.js";
import { Card, Layout, Typography } from "antd";

const Hint = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchHint = async () => {
            const res = await ServerFacade.getHint(id);
            if (res.ok) {
                setData(res.body);
            } else {
                setError(true);
            }
        };
        fetchHint();
    }, [id]);

    return (
        <>
            {error ? (
                <NotFound />
            ) : (
                <Layout style={{ padding: "20px", minHeight: "100vh" }}>
                    <Typography.Title>You found a hint!</Typography.Title>
                    <Card>
                        {!data ? (
                            <div>Loading...</div>
                        ) : (
                            <>
                                <Typography.Title level={5}>
                                    Game ID: {data.id}
                                </Typography.Title>
                                <Typography.Title level={5}>
                                    Hint: {data.hint}
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
