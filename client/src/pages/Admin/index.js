import React, { useEffect, useState } from "react";
import { Tabs, Table, Tag, Button, Popconfirm, message } from "antd";
import { AdminListAllVehicles, AdminRemoveVehicle, AdminListUsers, AdminSetUserBlocked } from "../../api/admin";

const Admin = () => {
  const [vehicles, setVehicles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const loadVehicles = async () => {
    setLoadingVehicles(true);
    const response = await AdminListAllVehicles();
    if (response?.success) setVehicles(response.data);
    else message.error(response?.message || "Could not load listings");
    setLoadingVehicles(false);
  };

  const loadUsers = async () => {
    setLoadingUsers(true);
    const response = await AdminListUsers();
    if (response?.success) setUsers(response.data);
    else message.error(response?.message || "Could not load users");
    setLoadingUsers(false);
  };

  useEffect(() => {
    loadVehicles();
    loadUsers();
  }, []);

  const handleRemoveVehicle = async (id) => {
    const response = await AdminRemoveVehicle(id);
    if (response?.success) {
      message.success("Listing removed from marketplace");
      loadVehicles();
    } else {
      message.error(response?.message || "Could not remove listing");
    }
  };

  const handleToggleBlock = async (id, blocked) => {
    const response = await AdminSetUserBlocked(id, blocked);
    if (response?.success) {
      message.success(blocked ? "User blocked" : "User unblocked");
      loadUsers();
    } else {
      message.error(response?.message || "Could not update user");
    }
  };

  const vehicleColumns = [
    { title: "Title", dataIndex: "title" },
    { title: "Brand", dataIndex: "brand" },
    { title: "Year", dataIndex: "year" },
    { title: "Price", dataIndex: "price", render: (p) => `₹${p.toLocaleString("en-IN")}` },
    { title: "Seller", dataIndex: "seller", render: (s) => s?.name },
    {
      title: "Status",
      dataIndex: "status",
      render: (s) => (
        <Tag color={s === "active" ? "green" : s === "sold" ? "red" : "default"}>{s.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Actions",
      render: (_, record) =>
        record.status !== "removed" ? (
          <Popconfirm title="Remove this listing from the marketplace?" onConfirm={() => handleRemoveVehicle(record._id)}>
            <Button danger size="small">
              Remove
            </Button>
          </Popconfirm>
        ) : (
          <Tag>Removed</Tag>
        ),
    },
  ];

  const userColumns = [
    { title: "Name", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    { title: "Role", dataIndex: "role" },
    {
      title: "Status",
      dataIndex: "isBlocked",
      render: (blocked) => <Tag color={blocked ? "red" : "green"}>{blocked ? "BLOCKED" : "ACTIVE"}</Tag>,
    },
    {
      title: "Actions",
      render: (_, record) =>
        record.role === "admin" ? (
          <Tag>Admin</Tag>
        ) : (
          <Button
            size="small"
            danger={!record.isBlocked}
            onClick={() => handleToggleBlock(record._id, !record.isBlocked)}
          >
            {record.isBlocked ? "Unblock" : "Block"}
          </Button>
        ),
    },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <Tabs
        items={[
          {
            key: "listings",
            label: "All Listings",
            children: (
              <Table
                rowKey="_id"
                columns={vehicleColumns}
                dataSource={vehicles}
                loading={loadingVehicles}
                scroll={{ x: true }}
              />
            ),
          },
          {
            key: "users",
            label: "Users",
            children: (
              <Table rowKey="_id" columns={userColumns} dataSource={users} loading={loadingUsers} scroll={{ x: true }} />
            ),
          },
        ]}
      />
    </div>
  );
};

export default Admin;
