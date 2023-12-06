import { Tag, Space, Modal, Button, message, Spin, notification } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Search from "antd/es/input/Search";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { url } from "../ultils/urlApi";
import { DataType, TYPE_USER, token } from "../constant/constant";
import FormAdd from "./FormAdd";
import FormEdit from "./FormEdit";

const UsersManager = () => {
  const [listUsers, setListUsers] = useState<DataType[]>([]);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<DataType>();
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const getData = async () => {
    setLoading(true);
    try {
      await axios
        .get(url + "/v1/users", {
          params: {
            page: currentPage,
            per_page: perPage,
          },
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setListUsers(response.data.data.users);
          setTotalItems(response.data.data.total_items);
          setPerPage(response.data.data.per_page);
        });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getData();
  }, [currentPage, perPage]);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log(currentPage)
  };
  const handlePageSizeChange = (pageSize: number) => {
    const newPerPage = pageSize;
    const newCurrentPage =
      Math.ceil(((currentPage - 1) * perPage) / newPerPage) + 1;
    setCurrentPage(newCurrentPage);
    console.log(newCurrentPage)
  };
  const pagination = {
    current: currentPage,
    pageSize: perPage,
    total: totalItems,
    onChange: handlePageChange,
    onShowSizeChange: handlePageSizeChange,
  };
  const columns: ColumnsType<DataType> = [
    {
      align: "center",
      title: "User ID",
      key: "user_id",
      dataIndex: "user_id",
    },
    {
      align: "center",
      title: "User Name",
      dataIndex: "user_name",
      key: "user_name",
    },
    {
      align: "center",
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      align: "center",
      title: "Phone Number",
      dataIndex: "phone_number",
      key: "phone_number",
    },
    {
      align: "center",
      title: "Role Name",
      dataIndex: "role_name",
      render: (_, { role_name }) => (
        <>
          {role_name.map((role_name, key) => {
            let color = role_name === TYPE_USER.ADMIN ? "pink" : "green";
            return (
              <Tag color={color} key={key}>
                {role_name.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },

    {
      align: "center",
      title: "Action",
      key: "action",
      render: (_text, user) => (
        <Space size="middle">
          <EditOutlined onClick={() => handleSelectUser(user)} />
          <DeleteOutlined onClick={() => handleToggleDelete(user)} />
        </Space>
      ),
    },
  ];

  const handleSearch = async (value: string) => {
    if (value.length === 0) {
      getData();
    } else {
      try {
        await axios
          .get(url + '/v1/users/search', {
            params: {
              search: value,
            },
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": true,
            },
          })
          .then((response) => {
            setListUsers(response.data.data.users);
            setTotalItems(response.data.data.total_items);

          })
      } catch (error: any) {
        notification.error(error)

      }
    }
  };


  const handleToggleDelete = (user: DataType) => {
    setSelectedUser(user);
    setIsModalDeleteOpen(true);
  };
  const handleSelectUser = (user: DataType) => {
    handleModalEditUser(true);
    setSelectedUser(user);

  };
  const handleAddUser = (user: DataType) => {
    const listUserSet = listUsers.concat(user)
    setListUsers(listUserSet)
  }
  const handleEditUser = (editUser: DataType) => {
    if (selectedUser) {
      setListUsers((prevListUsers) =>
        prevListUsers.map((user) =>
          user.user_id === selectedUser.user_id ? { ...user, ...editUser } : user
        )
      );

    }
  };

  const handleDelete = (_id: any) => {
    if (selectedUser) {
      try {
        axios
          .delete(url + "/v1/users/" + selectedUser.user_id, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setListUsers(response.data.users);
            Modal.success({
              content: response.data.message,
            });
            setIsModalDeleteOpen(false);
            getData();
          })
      } catch (error: any) {
        notification.error(error.response.data.message);

      }
    }
  };


  const handleCancel = () => {
    setIsModalDeleteOpen(false);
    handleModalEditUser(false);
    handleModalAddUser(false);
  };

  const showModal = () => {
    handleModalAddUser(true);
  };
  const handleModalAddUser = (status: boolean) => {
    setIsModalOpen(status);
  };
  const handleModalEditUser = (status: boolean) => {
    setIsModalEditOpen(status);
  };

  return (
    <div>

      <>
        <Space
          style={{
            marginBottom: 20,
            justifyContent: "space-between",
            columnGap: 20,
            width: "100%",
          }}
          className="search"
        >
          <Search
            placeholder="Search..."
            enterButton={<SearchOutlined />}
            onSearch={handleSearch}
          />
          <Button type="primary" onClick={showModal}>
            Add New User
          </Button>

        </Space>
        <Spin
          spinning={loading}
          size="large"
          tip="Loading..."
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "24px",
          }}
        >
          <Table
          
            columns={columns}
            dataSource={listUsers}
            pagination={pagination}

            
          />
        </Spin>


        <Modal
          title="Delete"
          open={isModalDeleteOpen}
          onOk={handleDelete}
          onCancel={handleCancel}
          okText="Confirm"
          cancelText="Cancel"
        >
          <p>Confirm delete this user ??</p>
        </Modal>
        <Modal
          title="User Infomation"
          destroyOnClose={true}
          open={isModalOpen}
          footer={[]}
          onCancel={handleCancel}
          style={{ width: "500px", textAlign: "center" }}
        >
          <FormAdd onModalAddUser={handleModalAddUser} onAddUser={handleAddUser} />
        </Modal>
        <Modal
          title="Edit User Information"
          open={isModalEditOpen}
          destroyOnClose={true}
          footer={[]}
          onCancel={handleCancel}
          style={{ width: "500px", textAlign: "center" }}
        >
          <FormEdit onModalEditUser={handleModalEditUser} data={selectedUser} onEditUser={handleEditUser} />
        </Modal>
      </>
    </div>
  );
};

export default UsersManager;
