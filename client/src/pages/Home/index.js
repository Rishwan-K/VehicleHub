import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Input,
  Select,
  InputNumber,
  Button,
  Empty,
  Pagination,
  Space,
  message,
} from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import { SearchVehicles, GetLocations } from "../../api/vehicles";
import VehicleCard from "../../components/VehicleCard";

const CATEGORIES = ["Car", "Bike", "Truck", "Bus", "Auto Rickshaw", "Other"];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "year_desc", label: "Year: Newest first" },
];

const Home = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, total: 0, limit: 12 });
  const [locations, setLocations] = useState([]);

  const [filters, setFilters] = useState({
    q: "",
    category: undefined,
    brand: "",
    location: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    minYear: undefined,
    maxYear: undefined,
    sort: "newest",
  });

  const fetchVehicles = async (page = 1) => {
    try {
      setLoading(true);
      const params = { ...filters, page, limit: pagination.limit };
      Object.keys(params).forEach((k) => (params[k] === undefined || params[k] === "") && delete params[k]);

      const response = await SearchVehicles(params);
      if (response?.success) {
        setVehicles(response.data);
        setPagination(response.pagination);
      } else {
        message.error(response?.message || "Could not load listings");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles(1);
    GetLocations().then((res) => {
      if (res?.success) setLocations(res.data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyFilters = () => fetchVehicles(1);

  return (
    <div>
      {/* Hero search banner */}
      <div
        style={{
          background: "linear-gradient(160deg, #0b1f35 0%, #123659 100%)",
          padding: "40px 24px 56px",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <h1 className="vh-heading" style={{ color: "#fff", fontSize: 28, marginBottom: 8 }}>
            Find your next vehicle
          </h1>
          <p style={{ color: "#C9D3DC", marginBottom: 24 }}>
            Search real listings from real sellers — no dealers, no markup.
          </p>
          <Input.Search
            size="large"
            placeholder="Search by title, brand, or model..."
            prefix={<SearchOutlined style={{ color: "var(--vh-muted)" }} />}
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
            onSearch={applyFilters}
            enterButton="Search"
          />
        </div>
      </div>

      <div className="p-4 md:p-6 lg:p-8" style={{ marginTop: -32 }}>
        <Row gutter={[20, 20]}>
          <Col xs={24} md={6}>
            <div className="vh-card" style={{ padding: 18, position: "sticky", top: 76 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <FilterOutlined style={{ color: "var(--vh-amber-700, #C97C22)" }} />
                <span className="vh-heading" style={{ fontSize: 16 }}>
                  Filters
                </span>
              </div>
              <Space direction="vertical" style={{ width: "100%" }} size="middle">
                <div>
                  <p className="vh-eyebrow" style={{ marginBottom: 6 }}>Category</p>
                  <Select
                    allowClear
                    style={{ width: "100%" }}
                    placeholder="Any category"
                    value={filters.category}
                    onChange={(v) => setFilters({ ...filters, category: v })}
                    options={CATEGORIES.map((c) => ({ label: c, value: c }))}
                  />
                </div>

                <div>
                  <p className="vh-eyebrow" style={{ marginBottom: 6 }}>Brand</p>
                  <Input
                    placeholder="e.g. Maruti, Honda"
                    value={filters.brand}
                    onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                  />
                </div>

                <div>
                  <p className="vh-eyebrow" style={{ marginBottom: 6 }}>Location</p>
                  <Select
                    allowClear
                    showSearch
                    style={{ width: "100%" }}
                    placeholder="Any location"
                    value={filters.location}
                    onChange={(v) => setFilters({ ...filters, location: v })}
                    options={locations.map((loc) => ({ label: loc, value: loc }))}
                  />
                </div>

                <div>
                  <p className="vh-eyebrow" style={{ marginBottom: 6 }}>Price range (₹)</p>
                  <Space>
                    <InputNumber
                      placeholder="Min"
                      min={0}
                      value={filters.minPrice}
                      onChange={(v) => setFilters({ ...filters, minPrice: v })}
                    />
                    <InputNumber
                      placeholder="Max"
                      min={0}
                      value={filters.maxPrice}
                      onChange={(v) => setFilters({ ...filters, maxPrice: v })}
                    />
                  </Space>
                </div>

                <div>
                  <p className="vh-eyebrow" style={{ marginBottom: 6 }}>Year range</p>
                  <Space>
                    <InputNumber
                      placeholder="From"
                      min={1980}
                      max={2100}
                      value={filters.minYear}
                      onChange={(v) => setFilters({ ...filters, minYear: v })}
                    />
                    <InputNumber
                      placeholder="To"
                      min={1980}
                      max={2100}
                      value={filters.maxYear}
                      onChange={(v) => setFilters({ ...filters, maxYear: v })}
                    />
                  </Space>
                </div>

                <div>
                  <p className="vh-eyebrow" style={{ marginBottom: 6 }}>Sort by</p>
                  <Select
                    style={{ width: "100%" }}
                    value={filters.sort}
                    onChange={(v) => setFilters({ ...filters, sort: v })}
                    options={SORT_OPTIONS}
                  />
                </div>

                <Button type="primary" block onClick={applyFilters} loading={loading}>
                  Apply Filters
                </Button>
              </Space>
            </div>
          </Col>

          <Col xs={24} md={18}>
            {vehicles.length ? (
              <>
                <Row gutter={[20, 28]}>
                  {vehicles.map((v) => (
                    <Col xs={24} sm={12} lg={8} key={v._id}>
                      <VehicleCard vehicle={v} onClick={() => navigate(`/vehicle/${v._id}`)} />
                    </Col>
                  ))}
                </Row>

                <Row justify="center" style={{ marginTop: 32 }}>
                  <Pagination
                    current={pagination.page}
                    total={pagination.total}
                    pageSize={pagination.limit}
                    onChange={(page) => fetchVehicles(page)}
                  />
                </Row>
              </>
            ) : (
              <div className="vh-card" style={{ padding: 48 }}>
                <Empty description="No listings match your filters" />
              </div>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Home;
