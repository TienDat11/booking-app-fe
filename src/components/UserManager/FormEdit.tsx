import { Button, Checkbox, Col, Form, Input, Modal, Row, notification } from "antd";
import React, { useState } from "react";
import { DataType, TYPE_USER } from "../constant/constant";
import axios from "axios";
import { url } from "../ultils/urlApi";
import getCookie from "../route/Cookie";
import { handleError, handleSuccess } from "../ultils/ultilsApi";
import { showPopup } from "../ultils/Popup";
interface FormEditProps {
  onModalEditUser: (status: boolean) => void;
  data: DataType | undefined;
  onEditUser: (editUser: DataType) => void;
}
const FormEdit: React.FC<FormEditProps> = ({ onModalEditUser, data, onEditUser }) => {
  const [form] = Form.useForm();
  const token = getCookie("token");
  const [loading, setLoading] = useState<boolean>(false);
  const role = getCookie('roles');
  let apiurl: string = ''

  const handleUpdate = async (value: any) => {
    console.log('update với value', value, ' role ', role)
    if (data) {
      try {
        setLoading(true)
        { role.includes('admin') ? apiurl = "/v1/users/" + data.user_id : apiurl = "/v1/users/profile" }
        await axios
          .put(url + apiurl, value, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response: any) => {
            onEditUser(value)
            const { message } = handleSuccess(response);
            showPopup(true, message);
            onModalEditUser(false);
          })
      } catch (error: any) {
        const { message, errors }: any = handleError(error);
        const messageErrors = message + " " + errors;
        showPopup(false, messageErrors);
      } finally {
        setLoading(false)
      }
    };
  }
  return (
    <>
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
          initialValues={data}
          onFinish={handleUpdate}
        >
          <Form.Item
            label="User Name"
            name="user_name"
            rules={[
              { required: true, message: "Please input user name!" },
              { whitespace: true },
            ]}
            hasFeedback
          >
            <Input />
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
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Phone Number"
            name="phone_number"
            rules={[
              { required: true },
              {
                pattern: new RegExp("^[0-9]*$"),
                message: "Please enter a valid phone number!",
              },
              { whitespace: true },
              { min: 10, message: "Phone number has at least 10 numbers" },
              { max: 10, message: "Phone number has at most 10 numbers"}
            ]}
            hasFeedback
          >
            <Input />
          </Form.Item>
          {role.includes('admin') ? (
            <Form.Item
              name="role_id"
              label="Role"
              rules={[{ required: true, message: "Please select role!" }]}
              hasFeedback
            >
              <Checkbox.Group  >
                <Row>
                  <Col span={12}>
                    <Checkbox value={1} style={{ lineHeight: "32px" }}>
                      Admin
                    </Checkbox>
                  </Col>
                  <Col span={12}>
                    <Checkbox value={2} style={{ lineHeight: "32px" }}>
                      User
                    </Checkbox>
                  </Col>
                </Row>
              </Checkbox.Group>
            </Form.Item>
          ) : null}
          <Button style={{ width: 200 }} type="primary" htmlType="submit" loading={loading}>
            Update
          </Button>
        </Form>

      </div>
    </>
  );
};

export default FormEdit;
