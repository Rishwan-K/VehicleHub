import React, { useEffect, useState } from "react";
import { Form, Input, InputNumber, Select, Button, Upload, message, Spin, Image } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { GetVehicleById, UpdateListing } from "../../api/vehicles";
import { UploadImages } from "../../api/upload";
import { useSelector } from "react-redux";

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

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.users);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [existingImages, setExistingImages] = useState([]);
  const [newFileList, setNewFileList] = useState([]);

  const load = async () => {
    setLoading(true);
    const response = await GetVehicleById(id);
    if (response?.success) {
      const v = response.data;
      if (user && String(v.seller?._id) !== String(user._id) && user.role !== "admin") {
        message.error("You can only edit your own listings");
        navigate("/my-listings");
        return;
      }
      form.setFieldsValue({
        title: v.title,
        category: v.category,
        brand: v.brand,
        model: v.model,
        year: v.year,
        price: v.price,
        fuelType: v.fuelType,
        kmDriven: v.kmDriven,
        condition: v.condition,
        location: v.location,
        description: v.description,
      });
      setExistingImages(v.images || []);
    } else {
      message.error(response?.message || "Could not load listing");
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const removeExistingImage = (url) => {
    setExistingImages((prev) => prev.filter((img) => img !== url));
  };

  const onFinish = async (values) => {
    try {
      setSubmitting(true);

      let newUrls = [];
      if (newFileList.length) {
        const uploadResponse = await UploadImages(newFileList.map((f) => f.originFileObj));
        if (uploadResponse?.success) {
          newUrls = uploadResponse.data.urls;
        } else {
          message.error(uploadResponse?.message || "Image upload failed");
          setSubmitting(false);
          return;
        }
      }

      const response = await UpdateListing(id, { ...values, images: [...existingImages, ...newUrls] });
      if (response?.success) {
        message.success("Listing updated!");
        navigate(`/vehicle/${id}`);
      } else {
        message.error(response?.message || "Could not update listing");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spin size="large" style={{ display: "block", margin: "80px auto" }} />;

  return (
    <div className="p-4 md:p-6 lg:p-8" style={{ maxWidth: 720, margin: "0 auto" }}>
      <h2 className="vh-heading" style={{ fontSize: 22, marginBottom: 4 }}>
        Edit listing
      </h2>
      <p style={{ color: "var(--vh-muted)", marginBottom: 24 }}>
        Update the details below and save your changes.
      </p>

      <div className="vh-card" style={{ padding: 28 }}>
        <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
          <SectionHeader>Basic info</SectionHeader>
          <Form.Item name="title" label="Ad Title" rules={[{ required: true }]}>
            <Input size="large" />
          </Form.Item>

          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Select options={CATEGORIES.map((c) => ({ label: c, value: c }))} size="large" />
          </Form.Item>

          <Form.Item name="brand" label="Brand" rules={[{ required: true }]}>
            <Input size="large" />
          </Form.Item>

          <Form.Item name="model" label="Model" rules={[{ required: true }]}>
            <Input size="large" />
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

          <Form.Item name="condition" label="Condition">
            <Select
              options={[
                { label: "Used", value: "Used" },
                { label: "New", value: "New" },
              ]}
              size="large"
            />
          </Form.Item>

          <Form.Item name="location" label="Location">
            <Input size="large" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={4} />
          </Form.Item>

          <SectionHeader>Photos</SectionHeader>
          <Form.Item label="Current Photos">
            {existingImages.length ? (
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {existingImages.map((img) => (
                  <div key={img} style={{ position: "relative" }}>
                    <Image src={img} width={90} height={90} style={{ objectFit: "cover", borderRadius: 8 }} />
                    <Button
                      size="small"
                      danger
                      shape="circle"
                      icon={<DeleteOutlined />}
                      style={{ position: "absolute", top: -8, right: -8 }}
                      onClick={() => removeExistingImage(img)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "var(--vh-muted)" }}>No photos left — add some below.</p>
            )}
          </Form.Item>

          <Form.Item label="Add More Photos">
            <Upload
              listType="picture-card"
              fileList={newFileList}
              beforeUpload={() => false}
              onChange={({ fileList: fl }) => setNewFileList(fl.slice(0, 8))}
              multiple
            >
              {newFileList.length < 8 && (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Add Photo</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Button type="primary" htmlType="submit" size="large" block loading={submitting} style={{ marginTop: 8 }}>
            Save Changes
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default EditListing;
