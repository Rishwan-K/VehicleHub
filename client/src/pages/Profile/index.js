import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Row, Col, Form, Input, Button, message, Spin, Rate, List, Avatar, Modal, Input as AntInput, Empty } from "antd";
import { StarFilled, EditOutlined } from "@ant-design/icons";
import { GetPublicProfile, UpdateMyProfile } from "../../api/users";
import { SubmitRating, GetRatingsForUser } from "../../api/ratings";
import moment from "moment";
import VehicleCard from "../../components/VehicleCard";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.users);
  const [form] = Form.useForm();

  const isOwnProfile = !id || (user && String(id) === String(user._id));
  const profileId = id || user?._id;

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [ratingSummary, setRatingSummary] = useState({ average: null, count: 0 });
  const [listings, setListings] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [rateModalOpen, setRateModalOpen] = useState(false);
  const [rateStars, setRateStars] = useState(5);
  const [rateComment, setRateComment] = useState("");
  const [ratingSubmitting, setRatingSubmitting] = useState(false);

  const load = async () => {
    if (!profileId) return;
    setLoading(true);
    const [profileRes, ratingsRes] = await Promise.all([
      GetPublicProfile(profileId),
      GetRatingsForUser(profileId),
    ]);

    if (profileRes?.success) {
      setProfile(profileRes.data.user);
      setRatingSummary(profileRes.data.rating);
      setListings(profileRes.data.listings);
      form.setFieldsValue({
        name: profileRes.data.user.name,
        location: profileRes.data.user.location,
        phone: user?.phone,
      });
    } else {
      message.error(profileRes?.message || "Could not load profile");
    }

    if (ratingsRes?.success) setRatings(ratingsRes.data);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileId]);

  const handleSaveProfile = async (values) => {
    setSaving(true);
    const response = await UpdateMyProfile(values);
    setSaving(false);
    if (response?.success) {
      message.success("Profile updated");
      setEditing(false);
      load();
    } else {
      message.error(response?.message || "Could not update profile");
    }
  };

  const handleSubmitRating = async () => {
    setRatingSubmitting(true);
    const response = await SubmitRating(profileId, rateStars, rateComment);
    setRatingSubmitting(false);
    if (response?.success) {
      message.success("Rating submitted");
      setRateModalOpen(false);
      setRateComment("");
      load();
    } else {
      message.error(response?.message || "Could not submit rating");
    }
  };

  if (loading) return <Spin size="large" style={{ display: "block", margin: "80px auto" }} />;
  if (!profile) return null;

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <Row gutter={[20, 20]}>
        <Col xs={24} md={8}>
          <div className="vh-card">
            <div style={{ height: 72, background: "linear-gradient(120deg, #0b1f35, #123659)" }} />
            <div style={{ padding: "0 20px 20px", textAlign: "center", marginTop: -36 }}>
              <Avatar size={72} style={{ background: "#E8963A", color: "#0B1F35", fontWeight: 800, fontSize: 28, border: "3px solid #fff" }}>
                {profile.name?.[0]}
              </Avatar>
              <h2 className="vh-heading" style={{ marginTop: 12, marginBottom: 0, fontSize: 20 }}>
                {profile.name}
              </h2>
              {profile.location && <p style={{ color: "var(--vh-muted)", margin: "2px 0" }}>{profile.location}</p>}
              <p style={{ color: "var(--vh-muted)", fontSize: 13 }}>
                Member since {moment(profile.createdAt).format("MMM YYYY")}
              </p>

              <div style={{ margin: "12px 0" }}>
                {ratingSummary.count > 0 ? (
                  <>
                    <StarFilled style={{ color: "#E8963A" }} /> <b>{ratingSummary.average}</b> / 5{" "}
                    <span style={{ color: "var(--vh-muted)" }}>
                      ({ratingSummary.count} rating{ratingSummary.count !== 1 ? "s" : ""})
                    </span>
                  </>
                ) : (
                  <span style={{ color: "var(--vh-muted)" }}>No ratings yet</span>
                )}
              </div>

              {isOwnProfile ? (
                <Button icon={<EditOutlined />} onClick={() => setEditing((e) => !e)}>
                  {editing ? "Cancel" : "Edit Profile"}
                </Button>
              ) : (
                user && (
                  <Button type="primary" onClick={() => setRateModalOpen(true)}>
                    Rate this user
                  </Button>
                )
              )}
            </div>

            {isOwnProfile && editing && (
              <div style={{ padding: "0 20px 20px" }}>
                <Form form={form} layout="vertical" onFinish={handleSaveProfile} requiredMark={false}>
                  <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="phone" label="Phone">
                    <Input />
                  </Form.Item>
                  <Form.Item name="location" label="Location">
                    <Input placeholder="e.g. Coimbatore, Tamil Nadu" />
                  </Form.Item>
                  <Button type="primary" htmlType="submit" block loading={saving}>
                    Save
                  </Button>
                </Form>
              </div>
            )}
          </div>

          <div className="vh-card" style={{ marginTop: 16, padding: 20 }}>
            <p className="vh-eyebrow" style={{ marginBottom: 12 }}>
              Reviews{ratings.length ? ` (${ratings.length})` : ""}
            </p>
            {ratings.length ? (
              <List
                dataSource={ratings}
                renderItem={(r) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar>{r.ratedBy?.name?.[0]}</Avatar>}
                      title={
                        <>
                          {r.ratedBy?.name}{" "}
                          <Rate disabled defaultValue={r.stars} style={{ fontSize: 12, marginLeft: 6 }} />
                        </>
                      }
                      description={r.comment || <i style={{ color: "#bbb" }}>No comment</i>}
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="No reviews yet" />
            )}
          </div>
        </Col>

        <Col xs={24} md={16}>
          <h3 className="vh-heading" style={{ fontSize: 18, marginBottom: 16 }}>
            {isOwnProfile ? "Your" : `${profile.name}'s`} Active Listings
          </h3>
          {listings.length ? (
            <Row gutter={[20, 28]}>
              {listings.map((v) => (
                <Col xs={24} sm={12} key={v._id}>
                  <VehicleCard vehicle={v} imageHeight={150} onClick={() => navigate(`/vehicle/${v._id}`)} />
                </Col>
              ))}
            </Row>
          ) : (
            <div className="vh-card" style={{ padding: 40 }}>
              <Empty description="No active listings" />
            </div>
          )}
        </Col>
      </Row>

      <Modal
        title={`Rate ${profile.name}`}
        open={rateModalOpen}
        onCancel={() => setRateModalOpen(false)}
        onOk={handleSubmitRating}
        confirmLoading={ratingSubmitting}
      >
        <Rate value={rateStars} onChange={setRateStars} style={{ fontSize: 28, color: "#E8963A" }} />
        <AntInput.TextArea
          rows={3}
          placeholder="Optional comment about your experience..."
          value={rateComment}
          onChange={(e) => setRateComment(e.target.value)}
          style={{ marginTop: 12 }}
        />
      </Modal>
    </div>
  );
};

export default Profile;
