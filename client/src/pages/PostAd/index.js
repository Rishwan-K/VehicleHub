import React, { useState, useEffect } from "react";
import { Form, Input, InputNumber, Select, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { CreateListing, GetLocations } from "../../api/vehicles";
import { UploadImages } from "../../api/upload";

const CATEGORIES = ["Car", "Bike", "Truck", "Bus", "Auto Rickshaw", "Other"];
const FUEL_TYPES = ["Petrol", "Diesel", "Electric", "CNG", "Other"];

const SectionHeader = ({ children }) => (
  <p
    className="vh-eyebrow"
    style={{ margin: "0 0 16px", paddingBottom: 8, borderBottom: "1px solid var(--vh-line)" }}
  >
    {children}
  </p>
);

const PostAd = () => {
  const navigate = useNavigate();
  const [fileList, setFileList] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    GetLocations().then((res) => {
      if (res?.success) setLocations(res.data);
    });
  }, []);

  const onFinish = async (values) => {
    try {
      setSubmitting(true);

      let imageUrls = [];
      if (fileList.length) {
        const uploadResponse = await UploadImages(fileList.map((f) => f.originFileObj));
        if (uploadResponse?.success) {
          imageUrls = uploadResponse.data.urls;
        } else {
          message.error(uploadResponse?.message || "Image upload failed");
          setSubmitting(false);
          return;
        }
      }

      const response = await CreateListing({
        ...values,
        location: Array.isArray(values.location) ? values.location[0] || "" : values.location,
        images: imageUrls,
      });
      if (response?.success) {
        message.success("Listing posted!");
        navigate(`/vehicle/${response.data._id}`);
      } else {
        message.error(response?.message || "Could not post listing");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8" style={{ maxWidth: 720, margin: "0 auto" }}>
      <h2 className="vh-heading" style={{ fontSize: 22, marginBottom: 4 }}>
        Post an ad
      </h2>
      <p style={{ color: "var(--vh-muted)", marginBottom: 24 }}>
        Give buyers the details they'll actually want to know.
      </p>

      <div className="vh-card" style={{ padding: 28 }}>
        <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
          <SectionHeader>Basic info</SectionHeader>
          <Form.Item name="title" label="Ad Title" rules={[{ required: true }]}>
            <Input placeholder="e.g. 2019 Maruti Swift VXi — well maintained" size="large" />
          </Form.Item>

          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Select options={CATEGORIES.map((c) => ({ label: c, value: c }))} size="large" />
          </Form.Item>

          <Form.Item name="brand" label="Brand" rules={[{ required: true }]}>
            <Input placeholder="e.g. Maruti Suzuki" size="large" />
          </Form.Item>

          <Form.Item name="model" label="Model" rules={[{ required: true }]}>
            <Input placeholder="e.g. Swift" size="large" />
          </Form.Item>

          <Form.Item name="year" label="Year" rules={[{ required: true }]}>
            <InputNumber min={1980} max={2100} style={{ width: "100%" }} size="large" />
          </Form.Item>

          <SectionHeader>Pricing &amp; condition</SectionHeader>
          <Form.Item name="price" label="Price (₹)" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} size="large" />
          </Form.Item>

          <Form.Item name="fuelType" label="Fuel Type">
            <Select allowClear options={FUEL_TYPES.map((f) => ({ label: f, value: f }))} size="large" />
          </Form.Item>

          <Form.Item name="kmDriven" label="KM Driven">
            <InputNumber min={0} style={{ width: "100%" }} size="large" />
          </Form.Item>

          <Form.Item name="condition" label="Condition" initialValue="Used">
            <Select
              options={[
                { label: "Used", value: "Used" },
                { label: "New", value: "New" },
              ]}
              size="large"
            />
          </Form.Item>

          <Form.Item name="location" label="Location">
            <Select
              mode="tags"
              maxCount={1}
              showSearch
              placeholder="e.g. Coimbatore, Tamil Nadu — pick existing or type a new one"
              options={locations.map((loc) => ({ label: loc, value: loc }))}
              size="large"
            />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={4} placeholder="Describe the vehicle's condition, service history, etc." />
          </Form.Item>

          <SectionHeader>Photos</SectionHeader>
          <Form.Item label="Photos (up to 8)">
            <Upload
              listType="picture-card"
              fileList={fileList}
              beforeUpload={() => false}
              onChange={({ fileList: fl }) => setFileList(fl.slice(0, 8))}
              multiple
            >
              {fileList.length < 8 && (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Add Photo</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Button type="primary" htmlType="submit" size="large" block loading={submitting} style={{ marginTop: 8 }}>
            Post Listing
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default PostAd;
