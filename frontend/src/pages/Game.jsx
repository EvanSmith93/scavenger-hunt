import React, { useState, useEffect } from "react";
import ServerFacade from "../serverFacade/ServerFacade";
import {
  Button,
  Card,
  Form,
  Input,
  Layout,
  List,
  Modal,
  QRCode,
  Tooltip,
  Typography,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { useParams } from "react-router-dom";
import NotFound from "./404";
import {
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import { BASE_URL } from "../App";

export default function Game() {
  const { id } = useParams();

  const [editModal, setEditModal] = useState({ open: false });

  const [game, setGame] = useState(null);
  const [hints, setHints] = useState([]);
  const [error, setError] = useState(false);

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
    setHints((prevHints) => [...prevHints, { ...newHintJson, id: res.body }]);
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

  function getDownloadFunc(name) {
    return () => {
      const canvas = document.getElementById(name)?.querySelector("canvas");
      if (canvas) {
        const url = canvas.toDataURL();
        const a = document.createElement("a");
        a.download = `${name}.png`;
        a.href = url;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    };
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
                    {hints.map((hint, index) => {
                      const qrCodeName = `QR Code ${index + 1}`;
                      return (
                        <List.Item
                          key={index}
                          actions={[
                            <Button
                              type="link"
                              icon={<ExportOutlined />}
                              onClick={() =>
                                (window.location.href = `/hint/${hint.id}`)
                              }
                            />,
                            <Button
                              type="link"
                              icon={<EditOutlined />}
                              onClick={() => setEditModal({ hint, open: true })}
                            />,
                            <Button
                              type="text"
                              icon={<DeleteOutlined />}
                              onClick={() => deleteHint(hint.id)}
                              danger
                            />,
                          ]}
                        >
                          <List.Item.Meta
                            title={hint.name || undefined}
                            description={
                              <Typography.Text>
                                {hint.description}
                              </Typography.Text>
                            }
                          />
                          <Tooltip title="Download QR Code">
                            <QRCode
                              id={qrCodeName}
                              value={`${BASE_URL}/hint/${hint.id}`}
                              icon={`${BASE_URL}/favicon.ico`}
                              bgColor="#fff"
                              size={120}
                              onClick={getDownloadFunc(qrCodeName)}
                              style={{ cursor: "pointer" }}
                            />
                          </Tooltip>
                        </List.Item>
                      );
                    })}
                  </List>
                  <Button
                    type="primary"
                    style={{ marginTop: "8px" }}
                    onClick={() => setEditModal({ open: true })}
                  >
                    Add Hint
                  </Button>
                </Card>
              </>
            )}
          </Layout>
          <HintModal
            open={editModal.open}
            hint={editModal.hint}
            setOpen={(open) => setEditModal({ open })}
            onOk={(values) =>
              values.id ? updateHint(values) : addHint(values)
            }
          />
        </>
      )}
    </>
  );
}

export function HintModal({ hint, open, setOpen, onOk }) {
  const [form] = useForm();

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      onOk={form.submit}
      title={`${hint ? "Edit" : "Add"} Hint`}
      destroyOnClose
    >
      <Form
        labelCol={{ span: 6 }}
        form={form}
        initialValues={{
          name: hint?.name,
          description: hint?.description,
        }}
        preserve={false}
        onFinish={() => {
          onOk({ id: hint?.id, ...form.getFieldsValue() });
          setOpen(false);
          form.resetFields();
        }}
      >
        <Form.Item name="name" label="Name">
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
