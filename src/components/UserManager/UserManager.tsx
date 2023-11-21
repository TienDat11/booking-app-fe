import { Tag, Space, Popconfirm, Modal, Input, Form, FormInstance, Button, Checkbox, Row, Col, message } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Cookies from 'js-cookie';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import getCookie from '../route/Cookie';

const UsersManager = () => {
    const { Search } = Input;
    const token = getCookie('token');
    const url = 'https://c1a4-210-245-110-144.ngrok-free.app/'
    interface DataType {
        user_id: number,
        role_id: number[],
        user_name: string,
        role_name: string[],
        phone_number: string,
        email: string,

    }
    const role =
    {
        admin: 1,
        user: 2
    }

    const [list_users, setListusers] = useState([] as DataType[])
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [addUser, setAddUser] = useState([] as DataType[])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editUser, setEditUser] = useState<DataType>()
    const [selectedUser, setSelectedUser] = useState<DataType>();

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const getData = async () => {
        try {
            await axios.get(url + "v1/users", {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then(res => {
                setListusers(res.data.list_users)
            })
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        getData()
    }, [currentPage])
    const columns: ColumnsType<DataType> = [
        {
            align: 'center',
            title: "User ID",
            key: 'user_id',
            dataIndex: "user_id",
        },
        {
            align: 'center',
            title: "User Name",
            dataIndex: "user_name",
            key: 'user_name',

        },
        {
            align: 'center',
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            align: 'center',
            title: "Phone Number",
            dataIndex: "phone_number",
            key: "phone_number",
        },
        {
            align: 'center',
            title: 'Role Name',
            dataIndex: 'role_name',
            render: (_, { role_name }) => (
                <>
                    {role_name.map((role_name, key) => {
                        let color = role_name === "admin" ? 'pink' : 'green';
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
            align: 'center',
            title: "Action",
            key: "action",
            render: (_text, user) =>
                <Space size="middle">
                    <a onClick={() => handleToggleEdit(user)}>Edit</a>
                    <a onClick={() => handleToggleDelete(user)}>Delete</a>
                </Space>
        }
    ];

    const handleToggleDelete = (user: DataType) => {
        setSelectedUser(user);
        setIsModalDeleteOpen(true);

    }


    const handleDelete = (id: any) => {
        if (selectedUser) {
            axios
                .delete(url + "v1/users/" + selectedUser.user_id,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }).then((res) => {
                        setListusers(res.data.list_users);
                        setIsModalDeleteOpen(false)
                        getData()
                    })
                .catch((error) => {
                    message.error(error.response.data.description)
                });
        }

    }
    const [form] = Form.useForm();
    const handleToggleEdit = (user: DataType) => {
        setSelectedUser(user);
        setEditUser(user)
        setIsModalEditOpen(true);
        setEditName(user.user_name);
        setEditEmail(user.email);
        setEditNumber(user.phone_number);
        setRoleId(user.role_id)


    };
    const [user_name, setEditName] = useState("");
    const [email, setEditEmail] = useState("");
    const [phone_number, setEditNumber] = useState("");
    const [role_id, setRoleId] = useState<number[]>([]);


    const handelEditRole = (roleId: CheckboxValueType[]) => {
        setRoleId(roleId.map(id => Number(id)))

    };

    const onchangeName = (e: any) => {
        setEditName(e.target.value)
    }
    const onchangeEmail = (e: any) => {
        setEditEmail(e.target.value)
    }

    const onChangePhone = (e: any) => {
        setEditNumber(e.target.value)
    }
    const handleUpdate = async () => {
        if (selectedUser) {
            // console.log('data',editUser)

            await axios
                .put(url + "v1/users/" + selectedUser.user_id, {
                    user_name,
                    email,
                    phone_number,
                    role_id
                },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    })
                .then((res) => {
                    getData()
                    Modal.success({
                        content: res.data.message
                    })
                    setIsModalEditOpen(false)
                })
                .catch((error) => {
                    console.log(error)
                    Modal.error({
                        content: (error.response.data.description),
                    });
                });


        }

    };

    const handleCancel = () => {
        setIsModalDeleteOpen(false)
        setIsModalEditOpen(false)
        setIsModalOpen(false)

    };
    const SubmitButton = ({ form }: { form: FormInstance }) => {
        const [submittable, setSubmittable] = useState(false);
        const values = Form.useWatch([], form);
        React.useEffect(() => {
            form.validateFields({ validateOnly: true }).then(
                () => {
                    setSubmittable(true);
                },
                () => {
                    setSubmittable(false);
                },
            );
        }, [values]);
        return (
            <Button type="primary" htmlType="submit"
                onClick={handleSubmit}
                disabled={!submittable}>
                Submit
            </Button>
        );
    };
    const UpdateButton = ({ form }: { form: FormInstance }) => {
        const [updatetable, setUpdatetable] = useState(false);
        const values = Form.useWatch([], form);
        React.useEffect(() => {
            form.validateFields({ validateOnly: true }).then(
                () => {
                    setUpdatetable(true);
                },
                () => {
                    setUpdatetable(false);
                },
            );
        }, [values]);
        return (
            <Button type="primary" htmlType="submit" onClick={handleUpdate} disabled={!updatetable}>
                Submit
            </Button>
        );
    };
    const handleSubmit = async () => {
        await axios
            .post(url + "v1/users", addUser,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then((res) => {
                    setListusers(res.data.list_users);
                    Modal.success({
                        content: (res.data.message)
                    })
                    getData()
                    setIsModalOpen(false);
                })
            .catch((error) => {
                Modal.error({
                    content: (error.response.data.description),
                });
            });

    };
    const handelSelectRole = (roleId: CheckboxValueType[]) => {
        setAddUser(prevData => ({
            ...prevData,
            role_id: roleId,
        }));
    };

    const onAddName = (e: any) => {
        setAddUser(prevData => ({
            ...prevData,
            user_name: e.target.value
        }))
    }
    const onAddEmail = (e: any) => {
        setAddUser(prevData => ({
            ...prevData,
            email: e.target.value
        }))
    }
    const onAddPhone = (e: any) => {
        setAddUser(prevData => ({
            ...prevData,
            phone_number: e.target.value
        }))
    }
    const onAddPass = (e: any) => {
        setAddUser(prevData => ({
            ...prevData,
            password: e.target.value
        }))
    }
    const showModal = () => {
        setIsModalOpen(true);
    };
    

    return (
        <div>
            <Space style={{ marginBottom: 20, justifyContent: 'space-between', columnGap: 20 }}>
                <Search placeholder="input search text" style={{ width: '100%' }} enterButton />
                <Button type="primary" onClick={showModal} >
                    Add New User
                </Button>
            </Space>

            <Table 
            columns={columns} 
            dataSource={list_users} 
            pagination={{ 
                defaultPageSize: 10, 
                current:  currentPage, 
                showSizeChanger: true, 
                pageSizeOptions: ['10', '20', '30'] }} 
                
                />
            {/* modal add new user */}
            <Modal
                title="User Infomation"
                destroyOnClose={true}
                open={isModalOpen}
                footer={[]}
                onCancel={handleCancel}
                style={{ width: "500px", textAlign: "center" }}
            >
                <div style={{ padding: 20 }}>
                    <Form
                        name="validateOnly"
                        labelCol={{ flex: "150px" }}
                        labelAlign="left"
                        preserve={false}

                        form={form}
                        wrapperCol={{ flex: 1 }}
                        style={{ maxWidth: 600 }}
                    >
                        <Form.Item
                            label="User Name"
                            name="user_name"
                            rules={[
                                { required: true, message: "Name is required" },
                                { whitespace: true }
                            ]}
                        >
                            <Input
                                placeholder="Enter User Name"
                                onChange={onAddName} />
                        </Form.Item>

                        <Form.Item label="Email" name="email" rules={[
                            { required: true, message: 'Please input email!' },
                            { type: 'email', message: 'Invalid email format' },
                            { whitespace: true }
                        ]} hasFeedback
                        >
                            <Input
                                placeholder='Email'
                                onChange={onAddEmail} />
                        </Form.Item>
                        <Form.Item
                            label="Phone Number"
                            name="phone_number"
                            rules={[
                                { required: true, message: 'Please input phone-number!' },
                                { whitespace: true },
                                {
                                    pattern: /^\d+$/,
                                    // pattern: /[0-9]+{1,10}/,
                                    message: "Please input number!"
                                }
                            ]} hasFeedback

                        >
                            <Input placeholder="Phone Number" pattern="[0-9]{1,10}" type="tel" maxLength={10} onChange={onAddPhone} />
                        </Form.Item>
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                { required: true, message: 'Please input password!' },
                                { whitespace: true, message: 'Please input password!' }

                            ]} hasFeedback

                        >
                            <Input placeholder="Password" type="password" onChange={onAddPass} required />
                        </Form.Item>
                        <Form.Item
                            name="role_id"
                            label="Role"
                            rules={[
                                { required: true, message: 'Please select role!' },
                            ]} hasFeedback

                        >
                            <Checkbox.Group onChange={handelSelectRole} >
                                <Row>
                                    <Col span={12}>
                                        <Checkbox value={role.user} style={{ lineHeight: "32px" }}>
                                            User
                                        </Checkbox>
                                    </Col>
                                    <Col span={12}>
                                        <Checkbox value={role.admin} style={{ lineHeight: "32px" }}>
                                            Admin
                                        </Checkbox>
                                    </Col>
                                </Row>
                            </Checkbox.Group>
                        </Form.Item>
                        <Form.Item>
                            <Space>
                                <SubmitButton form={form} />
                            </Space>
                        </Form.Item>
                    </Form>
                </div>
            </Modal>

            {/* modal delete */}
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

            {/* Modal edit */}
            <Modal
                title="Edit User Information"
                open={isModalEditOpen}
                destroyOnClose={true}
                footer={[]}
                onCancel={handleCancel}
                style={{ width: "500px", textAlign: "center" }}
            >
                <div style={{ padding: 20 }}>
                    <Form
                        name="validateOnly"
                        labelCol={{ flex: "150px" }}
                        labelAlign="left"
                        form={form}
                        wrapperCol={{ flex: 1 }}
                        preserve={false}
                        colon={false}
                        style={{ maxWidth: 600 }}
                        initialValues={selectedUser}
                    >
                        <Form.Item label="User Name" name="user_name"
                            rules={[
                                { required: true, message: 'Please input user name!' },
                                { whitespace: true }
                            ]} hasFeedback
                        >
                            <Input
                                onChange={onchangeName} value={user_name}
                            />
                        </Form.Item>
                        <Form.Item label="Email" name="email" rules={[
                            { required: true, message: 'Please input your email!' },
                            {
                                pattern: /^[\w-]+(\.[\w-]+)*@hotmail\.com$|^[\w-]+(\.[\w-]+)*@outlook\.com$|^[\w-]+(\.[\w-]+)*@gmail\.com$/,
                                message: 'Please enter a valid email address!'
                            },
                            { whitespace: true }
                        ]} hasFeedback
                        >
                            <Input
                                onChange={onchangeEmail} />
                        </Form.Item>

                        <Form.Item label="Phone Number" name="phone_number"
                            rules={[
                                { required: true },
                                {
                                    pattern: new RegExp("^[0-9]*$"),
                                    message: 'Please enter a valid phone number!'
                                },
                                { whitespace: true }

                            ]} hasFeedback
                        >
                            <Input
                                pattern="[0-9]{1,10}"
                                maxLength={10}
                                onChange={onChangePhone}
                                required
                            />
                        </Form.Item>
                        <Form.Item
                            name="role_id"
                            label="Role"
                            rules={[
                                { required: true, message: 'Please select role!' },
                            ]} hasFeedback
                        >
                            <Checkbox.Group onChange={handelEditRole} >
                                <Row>
                                    <Col span={12}>
                                        <Checkbox value={role.user} style={{ lineHeight: "32px" }}>
                                            User
                                        </Checkbox>
                                    </Col>
                                    <Col span={12}>
                                        <Checkbox value={role.admin} style={{ lineHeight: "32px" }}>
                                            Admin
                                        </Checkbox>
                                    </Col>
                                </Row>
                            </Checkbox.Group>
                        </Form.Item>
                        <Form.Item>
                            <Space>
                                <UpdateButton form={form} />
                            </Space>
                        </Form.Item>
                    </Form>
                </div>
            </Modal>



        </div>
    )
}

export default UsersManager
