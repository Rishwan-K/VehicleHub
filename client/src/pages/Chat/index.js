import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { List, Avatar, Input, Button, Empty, Spin, message, Row, Col } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { GetMyConversations, GetMessages, SendMessage } from "../../api/chat";
import { getSocket } from "../../socket";

const Chat = () => {
  const { user } = useSelector((state) => state.users);
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(searchParams.get("conversation") || null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  // Prevents duplicates: the same message can arrive both as the direct API
  // response (when you're the sender) AND as a socket "new-message" broadcast
  // (since the sender is also joined to their own chat room). Only add it once.
  const addMessageIfNew = (msg) => {
    setMessages((prev) => (prev.some((m) => m._id === msg._id) ? prev : [...prev, msg]));
  };

  const loadConversations = async () => {
    setLoadingConvos(true);
    const response = await GetMyConversations();
    if (response?.success) {
      setConversations(response.data);
      if (!activeId && response.data.length) setActiveId(response.data[0]._id);
    } else {
      message.error(response?.message || "Could not load chats");
    }
    setLoadingConvos(false);
  };

  const loadMessages = async (conversationId) => {
    setLoadingMessages(true);
    const response = await GetMessages(conversationId);
    if (response?.success) setMessages(response.data);
    setLoadingMessages(false);
  };

  useEffect(() => {
    loadConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!activeId) return;
    loadMessages(activeId);

    const socket = getSocket();
    socket.emit("join-conversation", { conversationId: activeId });

    const handleNewMessage = (msg) => {
      if (msg.conversation === activeId) {
        addMessageIfNew(msg);
      }
    };
    socket.on("new-message", handleNewMessage);

    return () => {
      socket.emit("leave-conversation", { conversationId: activeId });
      socket.off("new-message", handleNewMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim()) return;
    try {
      setSending(true);
      const response = await SendMessage(activeId, text.trim());
      if (response?.success) {
        setText("");
        // We'll also get this back via the socket broadcast, but add it
        // immediately for a snappy feel — addMessageIfNew skips it if the
        // socket echo already arrived (or will skip the echo if this ran first).
        addMessageIfNew(response.data);
        loadConversations(); // refresh "last message" preview in the sidebar
      } else {
        message.error(response?.message || "Could not send message");
      }
    } finally {
      setSending(false);
    }
  };

  const activeConversation = conversations.find((c) => c._id === activeId);
  const otherPartyName = activeConversation
    ? String(activeConversation.buyer._id) === String(user._id)
      ? activeConversation.seller.name
      : activeConversation.buyer.name
    : "";

  return (
    <div className="p-4 md:p-6 lg:p-8" style={{ height: "calc(100vh - 140px)" }}>
      <Row style={{ height: "100%" }} gutter={16}>
        <Col xs={24} md={8} style={{ height: "100%", overflowY: "auto", borderRight: "1px solid #eee" }}>
          {loadingConvos ? (
            <Spin />
          ) : conversations.length ? (
            <List
              dataSource={conversations}
              renderItem={(c) => {
                const otherName =
                  String(c.buyer._id) === String(user._id) ? c.seller.name : c.buyer.name;
                return (
                  <List.Item
                    onClick={() => setActiveId(c._id)}
                    style={{
                      cursor: "pointer",
                      background: c._id === activeId ? "#f0f5ff" : "transparent",
                      padding: 12,
                    }}
                  >
                    <List.Item.Meta
                      avatar={<Avatar src={c.vehicle?.images?.[0]}>{otherName?.[0]}</Avatar>}
                      title={otherName}
                      description={
                        <>
                          <div style={{ fontSize: 12, color: "#888" }}>{c.vehicle?.title}</div>
                          <div style={{ fontSize: 13 }}>{c.lastMessage || "No messages yet"}</div>
                        </>
                      }
                    />
                  </List.Item>
                );
              }}
            />
          ) : (
            <Empty description="No conversations yet — start a chat from a vehicle listing" />
          )}
        </Col>

        <Col xs={24} md={16} style={{ height: "100%", display: "flex", flexDirection: "column" }}>
          {activeId ? (
            <>
              <div style={{ padding: "8px 12px", borderBottom: "1px solid #eee", fontWeight: 600 }}>
                {otherPartyName} {activeConversation && <span style={{ color: "#888", fontWeight: 400 }}>— {activeConversation.vehicle?.title}</span>}
              </div>

              <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
                {loadingMessages ? (
                  <Spin />
                ) : (
                  messages.map((m) => {
                    const isMine = String(m.sender._id) === String(user._id);
                    return (
                      <div
                        key={m._id}
                        style={{
                          display: "flex",
                          justifyContent: isMine ? "flex-end" : "flex-start",
                          marginBottom: 8,
                        }}
                      >
                        <div
                          style={{
                            background: isMine ? "#1677ff" : "#f0f0f0",
                            color: isMine ? "#fff" : "#000",
                            padding: "8px 12px",
                            borderRadius: 12,
                            maxWidth: "70%",
                          }}
                        >
                          {m.text}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={bottomRef} />
              </div>

              <div style={{ display: "flex", gap: 8, padding: 12, borderTop: "1px solid #eee" }}>
                <Input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onPressEnter={handleSend}
                  placeholder="Type a message..."
                />
                <Button type="primary" icon={<SendOutlined />} loading={sending} onClick={handleSend} />
              </div>
            </>
          ) : (
            <Empty description="Select a conversation" style={{ margin: "auto" }} />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Chat;