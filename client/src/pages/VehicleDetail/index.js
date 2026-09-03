import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Row, Col, Image, Tag, Button, Spin, message, Avatar } from "antd";
import {
  MessageOutlined,
  CarOutlined,
  CalendarOutlined,
  DashboardOutlined,
  EnvironmentOutlined,
  ToolOutlined,
  ThunderboltOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { GetVehicleById } from "../../api/vehicles";
import { StartConversation } from "../../api/chat";
import { useSelector } from "react-redux";

const STATUS_COLOR = { active: "green", sold: "default", removed: "red" };

const VehicleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.users);
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  const load = async () => {
    setLoading(true);
    const response = await GetVehicleById(id);
    if (response?.success) setVehicle(response.data);
    else message.error(response?.message || "Could not load listing");
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChatWithSeller = async () => {
    try {
      setStarting(true);
      const response = await StartConversation(vehicle._id);
      if (response?.success) {
        navigate(`/chats?conversation=${response.data._id}`);
      } else {
        message.error(response?.message || "Could not start chat");
      }
    } finally {
      setStarting(false);
    }
  };

  if (loading) return <Spin size="large" style={{ display: "block", margin: "80px auto" }} />;
  if (!vehicle) return null;

  const isOwnListing = user && String(vehicle.seller?._id) === String(user._id);

  const specs = [
    { icon: <CarOutlined />, label: "Brand", value: vehicle.brand },
    { icon: <CarOutlined />, label: "Model", value: vehicle.model },
    { icon: <CalendarOutlined />, label: "Year", value: vehicle.year },
    { icon: <ToolOutlined />, label: "Condition", value: vehicle.condition },
    vehicle.fuelType && { icon: <ThunderboltOutlined />, label: "Fuel Type", value: vehicle.fuelType },
    vehicle.kmDriven != null && {
      icon: <DashboardOutlined />,
      label: "KM Driven",
      value: vehicle.kmDriven.toLocaleString("en-IN"),
    },
    vehicle.location && { icon: <EnvironmentOutlined />, label: "Location", value: vehicle.location },
  ].filter(Boolean);

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <Row gutter={[28, 28]}>
        <Col xs={24} md={13}>
          <Image.PreviewGroup>
            <Row gutter={[8, 8]}>
              <Col span={24}>
                <Image
                  src={vehicle.images?.[0] || "https://placehold.co/700x450?text=No+Photo"}
                  style={{ width: "100%", borderRadius: 10, objectFit: "cover", maxHeight: 420 }}
                />
              </Col>
              {vehicle.images?.slice(1).map((img, i) => (
                <Col span={6} key={i}>
                  <Image src={img} style={{ width: "100%", borderRadius: 8 }} />
                </Col>
              ))}
            </Row>
          </Image.PreviewGroup>
        </Col>

        <Col xs={24} md={11}>
          <div className="vh-card" style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
              <div>
                <Tag color="blue" style={{ marginBottom: 8 }}>
                  {vehicle.category}
                </Tag>
                <h2 className="vh-heading" style={{ fontSize: 20, margin: 0 }}>
                  {vehicle.title}
                </h2>
              </div>
              <Tag color={STATUS_COLOR[vehicle.status] || "default"}>{vehicle.status.toUpperCase()}</Tag>
            </div>

            <span className="vh-price-tag vh-price-tag--lg" style={{ marginTop: 16, display: "inline-block" }}>
              ₹{vehicle.price.toLocaleString("en-IN")}
            </span>

            <div style={{ marginTop: 20 }}>
              {specs.map((s) => (
                <div className="vh-spec-row" key={s.label}>
                  <span className="vh-spec-icon">{s.icon}</span>
                  <span className="vh-spec-label">{s.label}</span>
                  <span className="vh-spec-value">{s.value}</span>
                </div>
              ))}
            </div>

            {vehicle.description && (
              <div style={{ marginTop: 20 }}>
                <p className="vh-eyebrow" style={{ marginBottom: 6 }}>Description</p>
                <p style={{ color: "var(--vh-ink)", lineHeight: 1.6, margin: 0 }}>{vehicle.description}</p>
              </div>
            )}

            <Link to={`/profile/${vehicle.seller?._id}`}>
              <div
                style={{
                  marginTop: 22,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  background: "var(--vh-canvas)",
                  borderRadius: 8,
                }}
              >
                <Avatar icon={<UserOutlined />} style={{ background: "#0E2A47" }} />
                <div>
                  <div style={{ fontWeight: 600, color: "var(--vh-ink)" }}>{vehicle.seller?.name}</div>
                  <div style={{ fontSize: 12, color: "var(--vh-muted)" }}>View seller profile</div>
                </div>
              </div>
            </Link>

            {!isOwnListing && vehicle.status === "active" && (
              <Button
                type="primary"
                size="large"
                icon={<MessageOutlined />}
                loading={starting}
                onClick={handleChatWithSeller}
                style={{ marginTop: 20 }}
                block
              >
                Chat with Seller
              </Button>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default VehicleDetail;
