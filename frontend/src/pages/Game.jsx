import React, { useState, useEffect } from "react";
import ServerFacade from "../serverFacade/ServerFacade";
import { Button, Card, Form, Input, Layout, List, Typography } from "antd";
import { useForm } from "antd/es/form/Form";
import { useParams } from "react-router-dom";
import NotFound from "./404";
import { DeleteOutlined } from "@ant-design/icons";

export default function Game() {
  const { id } = useParams();

  const [game, setGame] = useState(null);
  const [hints, setHints] = useState([]);
  const [error, setError] = useState(false);

  const [form] = useForm();

  async function updateGame(game) {
    const res = await ServerFacade.updateGame(game);
    if (res.ok) {
      setGame(game);
    }
  }

  async function addHint(values) {
    const newHintJson = {
      name: values.name,
      description: values.description,
      gameId: id,
    };
    const res = await ServerFacade.addHint(newHintJson);
    setHints((prevHints) => [...prevHints, { ...newHintJson, id: res.id }]);

    form.resetFields();
  }

  async function updateHint(hint) {
    const res = await ServerFacade.updateHint(hint);
    if (res.ok) {
      setHints(hints.map((h) => (h.id === hint.id ? hint : h)));
    }
  }

  async function deleteHint(id) {
    const res = await ServerFacade.deleteHint(id);
    if (res.ok) {
      setHints(hints.filter((h) => h.id !== id));
    }
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
          <Layout style={{ padding: "20px", minHeight: "100vh" }}>
            {!game ? (
              <div>Loading...</div>
            ) : (
              <>
                <Typography.Title
                  editable={{
                    onChange: (e) => updateGame({ ...game, name: e }),
                  }}
                  level={2}
                >
                  {game.name}
                </Typography.Title>
                <Card>
                  <List>
                    {hints.map((hint, index) => (
                      <List.Item
                        key={index}
                        actions={[
                          <Button
                            type="link"
                            onClick={() =>
                              (window.location.href = `/hint/${hint.id}`)
                            }
                          >
                            View Hint
                          </Button>,
                          <Button
                            onClick={() => deleteHint(hint.id)}
                            icon={<DeleteOutlined />}
                            type="text"
                            danger
                          />,
                        ]}
                      >
                        <List.Item.Meta
                          title={hint.name || undefined}
                          description={
                            <Typography.Text
                              editable={{
                                onChange: (e) =>
                                  updateHint({ ...hint, description: e }),
                              }}
                            >
                              {hint.description}
                            </Typography.Text>
                          }
                        />
                      </List.Item>
                    ))}
                  </List>

                  <Form form={form} onFinish={addHint}>
                    <Form.Item name="name" label="Name">
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="description"
                      label="Description"
                      rules={[{ required: true }]}
                    >
                      <Input.TextArea />
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
              </>
            )}
          </Layout>
        </>
      )}
    </>
  );
}
