import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Row, Col, Image, Tag, Button, Descriptions, Spin, message } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import { GetVehicleById } from "../../api/vehicles";
import { StartConversation } from "../../api/chat";
import { useSelector } from "react-redux";

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

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Image.PreviewGroup>
            <Row gutter={[8, 8]}>
              <Col span={24}>
                <Image
                  src={vehicle.images?.[0] || "https://placehold.co/700x450?text=No+Photo"}
                  style={{ width: "100%", borderRadius: 12, objectFit: "cover", maxHeight: 420 }}
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

        <Col xs={24} md={12}>
          <h2 style={{ marginBottom: 4 }}>{vehicle.title}</h2>
          <h1 style={{ color: "#c41d7f", fontSize: 32, margin: "8px 0" }}>
            ₹{vehicle.price.toLocaleString("en-IN")}
          </h1>

          <Tag color={vehicle.status === "active" ? "green" : vehicle.status === "sold" ? "red" : "default"}>
            {vehicle.status.toUpperCase()}
          </Tag>

          <Descriptions column={1} bordered size="small" style={{ marginTop: 16 }}>
            <Descriptions.Item label="Brand">{vehicle.brand}</Descriptions.Item>
            <Descriptions.Item label="Model">{vehicle.model}</Descriptions.Item>
            <Descriptions.Item label="Year">{vehicle.year}</Descriptions.Item>
            <Descriptions.Item label="Category">{vehicle.category}</Descriptions.Item>
            {vehicle.fuelType && <Descriptions.Item label="Fuel Type">{vehicle.fuelType}</Descriptions.Item>}
            {vehicle.kmDriven != null && (
              <Descriptions.Item label="KM Driven">{vehicle.kmDriven.toLocaleString("en-IN")}</Descriptions.Item>
            )}
            <Descriptions.Item label="Condition">{vehicle.condition}</Descriptions.Item>
            {vehicle.location && <Descriptions.Item label="Location">{vehicle.location}</Descriptions.Item>}
            <Descriptions.Item label="Seller">
              <Link to={`/profile/${vehicle.seller?._id}`}>{vehicle.seller?.name}</Link>
            </Descriptions.Item>
          </Descriptions>

          {vehicle.description && (
            <div style={{ marginTop: 16 }}>
              <h4>Description</h4>
              <p>{vehicle.description}</p>
            </div>
          )}

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
        </Col>
      </Row>
    </div>
  );
};

export default VehicleDetail;
