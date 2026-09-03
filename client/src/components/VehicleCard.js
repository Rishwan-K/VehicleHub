import React from "react";
import { Tag } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";

const STATUS_COLOR = {
  active: "green",
  sold: "default",
  removed: "red",
};

// Shared listing card used on Home, My Listings, and Profile — one place to
// keep the "price sticker on the photo" motif consistent across the app.
const VehicleCard = ({ vehicle: v, onClick, imageHeight = 180, footer }) => {
  return (
    <div className="vh-card vh-card--hoverable" style={{ cursor: onClick ? "pointer" : "default" }}>
      <div className="vh-card-media" onClick={onClick}>
        <img
          alt={v.title}
          src={v.images?.[0] || "https://placehold.co/400x250?text=No+Photo"}
          style={{ width: "100%", height: imageHeight, objectFit: "cover", display: "block" }}
        />
        <div className="vh-card-price-overlay">
          <span className="vh-price-tag">₹{v.price.toLocaleString("en-IN")}</span>
        </div>
      </div>

      <div style={{ padding: "22px 14px 14px" }} onClick={onClick}>
        <div style={{ fontWeight: 600, fontSize: 15, color: "var(--vh-ink)", marginBottom: 4 }}>
          {v.title}
        </div>
        <div style={{ color: "var(--vh-muted)", fontSize: 13, marginBottom: 8 }}>
          {v.brand} {v.model} · {v.year}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <Tag color="blue" style={{ marginInlineEnd: 0 }}>
            {v.category}
          </Tag>
          {v.status && v.status !== "active" && (
            <Tag color={STATUS_COLOR[v.status] || "default"}>{v.status.toUpperCase()}</Tag>
          )}
          {v.location && (
            <span style={{ color: "var(--vh-muted)", fontSize: 12, display: "inline-flex", alignItems: "center", gap: 3 }}>
              <EnvironmentOutlined /> {v.location}
            </span>
          )}
        </div>
      </div>

      {footer && <div style={{ padding: "0 14px 14px" }}>{footer}</div>}
    </div>
  );
};

export default VehicleCard;
