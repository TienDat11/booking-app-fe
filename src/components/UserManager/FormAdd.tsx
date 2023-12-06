import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Modal,
  Row,
} from "antd";
import React from "react";
import axios from "axios";
import { url } from "../ultils/urlApi";
import getCookie from "../route/Cookie";
import { useState } from "react";
import { DataType } from "../constant/constant";
import { handleSuccess, handleError } from "../ultils/ultilsApi";
import { showPopup } from "../ultils/Popup";

interface FormAddProps {
  onModalAddUser: (status: boolean) => void;
  onAddUser: (addUser: DataType) => void;
}
const FormAdd: React.FC<FormAddProps> = ({ onModalAddUser, onAddUser }) => {
  const [form] = Form.useForm();
  const token = getCookie("token");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (value: any) => {
    setLoading(true);
    try {
      await axios
        .post(url + "/v1/users", value, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          onAddUser(value)
          const { message } = handleSuccess(response);
          showPopup(true, message);
          onModalAddUser(false)
        })
    } catch (error: any) {
      const { message, errors }: any = handleError(error);
      const messageErrors = message + " " + errors;
      showPopup(false, messageErrors);
    } finally {
      setLoading(false)
    }
  };
  return (
    <div style={{ padding: 20 }}>
      <Form
        name="validateOnly"
        labelCol={{ flex: "150px" }}
        labelAlign="left"
        preserve={false}
        form={form}
        onFinish={handleSubmit}
        wrapperCol={{ flex: 1 }}
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          label="User Name"
          name="user_name"
          rules={[
            { required: true, message: "Name is required" },
            { whitespace: true },
          ]}
        >
          <Input placeholder="Enter User Name" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please input email!" },
            { type: "email", message: "Invalid email format" },
            { whitespace: true },
          ]}
          hasFeedback
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item
          label="Phone Number"
          name="phone_number"
          rules={[
            { required: true, message: "Please input phone-number!" },
            { min: 10, message: "Phone number has at least 10 numbers" },
            { max: 10, message: "Phone number has at most 10 numbers" },

            { whitespace: true },
            {
              pattern: /^\d+$/,
              message: "Please input number!",
            },
          ]}
          hasFeedback
        >
          <Input placeholder="Phone Number" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Please input password!" },
            { whitespace: true, message: "Please input password!" },
            { min: 8, message: "Password has at least 8 letters " }
          ]}
          hasFeedback
        >
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item
          name="role_id"
          label="Role"
          rules={[{ required: true, message: "Please select role!" }]}
          hasFeedback
        >
          <Checkbox.Group>
            <Row>
              <Col span={12}>
                <Checkbox value={2} style={{ lineHeight: "32px" }}>
                  User
                </Checkbox>
              </Col>
              <Col span={12}>
                <Checkbox value={1} style={{ lineHeight: "32px" }}>
                  Admin
                </Checkbox>
              </Col>
            </Row>
          </Checkbox.Group>
        </Form.Item>
        <Button style={{ width: 200 }} loading={loading} type="primary" htmlType="submit" >
          Submit
        </Button>
      </Form>

    </div>
  );
};

export default FormAdd;
