import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NotFound from "./404.jsx";
import ServerFacade from "../serverFacade/ServerFacade.js";
import { Card, Layout, Space, Typography } from "antd";
import Cookies from "js-cookie";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

export default function Hint() {
  const { id } = useParams();
  const [hint, setHint] = useState(null);
  const [hintCount, setHintCount] = useState(null);
  const [hintsFound, setHintsFound] = useState([]);
  const [isNewHint, setIsNewHint] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    function getCookies(gameId) {
      let found = JSON.parse(Cookies.get(`hints-game-${gameId}`) || "[]");
      if (!found.includes(id)) {
        found.push(id);
        Cookies.set(`hints-game-${gameId}`, JSON.stringify(found));
        setIsNewHint(true);
      }
      return found;
    }

    async function fetch() {
      const hint = await ServerFacade.getHint(id);
      if (!hint.ok) {
        setError(true);
        return;
      }

      const count = await ServerFacade.getHintCount(hint.body.gameId);
      if (!count.ok) {
        setError(true);
        return;
      }

      setHint(hint.body);
      setHintCount(count.body);

      const foundHints = getCookies(hint.body.gameId);
      const validHints = await ServerFacade.validateHints(
        hint.body.gameId,
        foundHints
      );
      if (!validHints.ok) {
        setError(true);
        return;
      }
      setHintsFound(validHints.body);
    }
    fetch();
  }, [id]);

  const icons = [];
  for (let i = 0; i < hintCount; i++) {
    if (i < hintsFound.length) {
      icons.push(<CheckCircleOutlined key={i} style={{ color: "green" }} />);
    } else {
      icons.push(<CloseCircleOutlined key={i} style={{ color: "grey" }} />);
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
                <Space style={{ fontSize: "30px" }}>{icons}</Space>
                <Typography.Title level={5}>
                  Game ID: {hint.gameId}
                </Typography.Title>
                <Typography.Title level={5}>Name: {hint.name}</Typography.Title>
                <Typography.Title level={5}>
                  Description: {hint.description}
                </Typography.Title>
              </>
            )}
          </Card>
        </Layout>
      )}
    </>
  );
}
