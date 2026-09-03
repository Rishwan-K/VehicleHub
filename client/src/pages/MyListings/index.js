import React, { useEffect, useState } from "react";
import { Row, Col, Button, message, Popconfirm, Empty, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { GetMyListings, MarkAsSold, DeleteListing } from "../../api/vehicles";
import VehicleCard from "../../components/VehicleCard";

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
      <h2 className="vh-heading" style={{ fontSize: 22, marginBottom: 4 }}>
        My listings
      </h2>
      <p style={{ color: "var(--vh-muted)", marginBottom: 24 }}>
        Manage what you've posted — edit details, mark as sold, or remove a listing.
      </p>

      {listings.length ? (
        <Row gutter={[20, 28]}>
          {listings.map((v) => (
            <Col xs={24} sm={12} md={8} key={v._id}>
              <VehicleCard
                vehicle={v}
                imageHeight={160}
                onClick={() => navigate(`/vehicle/${v._id}`)}
                footer={
                  <>
                    <p style={{ margin: "0 0 10px", color: "var(--vh-muted)", fontSize: 12 }}>
                      {v.views || 0} views
                    </p>
                    <div style={{ display: "flex", gap: 8 }}>
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
                  </>
                }
              />
            </Col>
          ))}
        </Row>
      ) : (
        <div className="vh-card" style={{ padding: 48 }}>
          <Empty description="You haven't posted any listings yet" />
        </div>
      )}
    </div>
  );
};

export default MyListings;
