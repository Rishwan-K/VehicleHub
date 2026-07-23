import React, { useEffect, useState } from "react";
import { Row, Col, Card, Tag, Button, message, Popconfirm, Empty, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { GetMyListings, MarkAsSold, DeleteListing } from "../../api/vehicles";

const MyListings = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const response = await GetMyListings();
    if (response?.success) setListings(response.data);
    else message.error(response?.message || "Could not load your listings");
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleMarkSold = async (id) => {
    const response = await MarkAsSold(id);
    if (response?.success) {
      message.success("Marked as sold");
      load();
    } else {
      message.error(response?.message || "Could not update listing");
    }
  };

  const handleDelete = async (id) => {
    const response = await DeleteListing(id);
    if (response?.success) {
      message.success("Listing deleted");
      load();
    } else {
      message.error(response?.message || "Could not delete listing");
    }
  };

  if (loading) return <Spin size="large" style={{ display: "block", margin: "80px auto" }} />;

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {listings.length ? (
        <Row gutter={[16, 16]}>
          {listings.map((v) => (
            <Col xs={24} sm={12} md={8} key={v._id}>
              <Card
                cover={
                  <img
                    alt={v.title}
                    src={v.images?.[0] || "https://placehold.co/400x250?text=No+Photo"}
                    style={{ height: 160, objectFit: "cover", cursor: "pointer" }}
                    onClick={() => navigate(`/vehicle/${v._id}`)}
                  />
                }
              >
                <Card.Meta
                  title={v.title}
                  description={
                    <>
                      <p style={{ margin: 0, fontWeight: 700 }}>₹{v.price.toLocaleString("en-IN")}</p>
                      <Tag
                        color={v.status === "active" ? "green" : v.status === "sold" ? "red" : "default"}
                        style={{ marginTop: 6 }}
                      >
                        {v.status.toUpperCase()}
                      </Tag>
                      <p style={{ marginTop: 8, color: "#888" }}>{v.views || 0} views</p>
                    </>
                  }
                />
                <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                  <Button size="small" onClick={() => navigate(`/edit-listing/${v._id}`)}>
                    Edit
                  </Button>
                  {v.status === "active" && (
                    <Button size="small" onClick={() => handleMarkSold(v._id)}>
                      Mark as Sold
                    </Button>
                  )}
                  <Popconfirm title="Delete this listing?" onConfirm={() => handleDelete(v._id)}>
                    <Button size="small" danger>
                      Delete
                    </Button>
                  </Popconfirm>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Empty description="You haven't posted any listings yet" />
      )}
    </div>
  );
};

export default MyListings;
