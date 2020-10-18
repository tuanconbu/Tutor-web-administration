import React, { useEffect, useState } from "react";
import Details from "../../../../../pages/users/Details";
import { Link } from "react-router-dom";
import { Table, Space, Button, Tag, notification } from "antd";
import * as moment from "moment";
import {
  FolderViewOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import UsersServices from "../../../../../api/UsersServices";

function Users() {
  //local state
  const [selectedUser, setSelectedUser] = useState([]);
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadData = () => {
    UsersServices.getUsers()
      .then((res) => {
        setData(res[0].data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("error", err);
      });
  };
  useEffect(() => {
    setLoading(true);
    loadData();
  }, []);

  const openNotificationWithIcon = (type, message, description) => {
    notification[type]({
      message: message,
      description: description,
      duration: 2,
    });
  };
  const onSelect = (item) => {
    setSelectedUser(item);
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const onDelete = (id) => {
    setLoading(true);
    UsersServices.deleteUser(id)
      .then((res) => {
        setLoading(false);
        openNotificationWithIcon(
          "success",
          "Success!",
          "This user doesn't exist anymore !"
        );
        loadData();
      })
      .catch((err) => {
        setLoading(false);
        openNotificationWithIcon("error", "Error!", "Deleted failed");
        loadData();
      });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (id) => `${id}`,
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      sorter: {
        compare: (a, b) => a.username.length - b.username.length,
      },
      render: (username) => <div>{username}</div>,
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (gender) => `${gender ? "Male" : "Female"}`,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => `${email}`,
    },
    {
      title: "Created Date",
      dataIndex: "creationDate",
      key: "creationDate",
      render: (creationDate) => `${moment(creationDate).format("MMM Do YY")}`,
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (phoneNumber) => `${phoneNumber}`,
    },
    {
      title: "Role",
      dataIndex: "authority",
      key: "authority",
      render: (authority) => {
        let color = "green";
        const activeStatus =
          authority === "ROLE_ADMIN"
            ? "ADMIN"
            : authority === "ROLE_TUTOR"
            ? "TUTOR"
            : "STUDENT";
        if (activeStatus === "ADMIN") {
          color = "#f44336";
        } else if (activeStatus === "TUTOR") {
          color = "#0288d1";
        } else color = "#ffc400";
        return (
          <Tag color={color} key={activeStatus}>
            {activeStatus.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      responsive: ["lg"],
      render: (record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<FolderViewOutlined />}
            onClick={() => onSelect(record)}
          >
            More
          </Button>
          <Link target="_top" to={`/home/users/${record.id}/edit`}>
            <Button icon={<EditOutlined />}>Edit</Button>
          </Link>
          <Button
            danger
            icon={<DeleteOutlined />}
            loading={loading}
            type="primary"
            onClick={() => {
              onDelete(record.id);
            }}
          >
            Delete
          </Button>
          <Button style={{ backgroundColor: "#1976d2", color: "white" }}>
            {record.activation ? "Active" : "Inactive"}
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <>
      <Table
        loading={loading}
        dataSource={data}
        columns={columns}
        size="small"
        bordered
        rowKey={(record) => `${record.id}`}
      />
      <Details user={selectedUser} visible={visible} onClose={onClose} />
    </>
  );
}

export default Users;