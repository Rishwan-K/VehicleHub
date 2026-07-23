import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Input,
  Select,
  InputNumber,
  Button,
  Card,
  Empty,
  Pagination,
  Tag,
  Space,
  message,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { SearchVehicles, GetLocations } from "../../api/vehicles";

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
    <div className="p-4 md:p-6 lg:p-8">
      <Row justify="center" style={{ marginBottom: 24 }}>
        <Col xs={24} md={16}>
          <Input.Search
            size="large"
            placeholder="Search by title, brand, or model..."
            prefix={<SearchOutlined />}
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
            onSearch={applyFilters}
            enterButton
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <Card title="Filters" size="small">
            <Space direction="vertical" style={{ width: "100%" }} size="middle">
              <div>
                <p style={{ marginBottom: 4 }}>Category</p>
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
                <p style={{ marginBottom: 4 }}>Brand</p>
                <Input
                  placeholder="e.g. Maruti, Honda"
                  value={filters.brand}
                  onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                />
              </div>

              <div>
                <p style={{ marginBottom: 4 }}>Location</p>
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
                <p style={{ marginBottom: 4 }}>Price Range (₹)</p>
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
                <p style={{ marginBottom: 4 }}>Year Range</p>
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
                <p style={{ marginBottom: 4 }}>Sort By</p>
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
          </Card>
        </Col>

        <Col xs={24} md={18}>
          {vehicles.length ? (
            <>
              <Row gutter={[16, 16]}>
                {vehicles.map((v) => (
                  <Col xs={24} sm={12} lg={8} key={v._id}>
                    <Card
                      hoverable
                      onClick={() => navigate(`/vehicle/${v._id}`)}
                      cover={
                        <img
                          alt={v.title}
                          src={v.images?.[0] || "https://placehold.co/400x250?text=No+Photo"}
                          style={{ height: 180, objectFit: "cover" }}
                        />
                      }
                    >
                      <Card.Meta
                        title={v.title}
                        description={
                          <>
                            <p style={{ margin: 0, fontWeight: 700, color: "#c41d7f" }}>
                              ₹{v.price.toLocaleString("en-IN")}
                            </p>
                            <p style={{ margin: 0 }}>
                              {v.brand} {v.model} • {v.year}
                            </p>
                            <Tag color="blue" style={{ marginTop: 6 }}>
                              {v.category}
                            </Tag>
                          </>
                        }
                      />
                    </Card>
                  </Col>
                ))}
              </Row>

              <Row justify="center" style={{ marginTop: 24 }}>
                <Pagination
                  current={pagination.page}
                  total={pagination.total}
                  pageSize={pagination.limit}
                  onChange={(page) => fetchVehicles(page)}
                />
              </Row>
            </>
          ) : (
            <Empty description="No listings match your filters" />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Home;
