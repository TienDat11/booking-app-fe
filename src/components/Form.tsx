import React, { useState } from 'react';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { Button, Form, Input, Spin, Typography, Modal } from 'antd';
import axios from 'axios';
import confirm from './Confirm';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';


const { Title, Text } = Typography;

const url: string = 'https://c1a4-210-245-110-144.ngrok-free.app';
const FormLogin: React.FC = () => {
  const Navigate = useNavigate();
  const [form] = Form.useForm();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const handleOk = () => {
    Modal.destroyAll();
     Navigate('/');
  };

  const handleClose = () => {
    Modal.destroyAll();
    Navigate('/login')
  }

  const handleError = (errorMessage: string) => {
    Modal.destroyAll();
    confirm(errorMessage, false, handleClose);
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    await axios
      .post(url + '/v1/login', values, {
        withCredentials: true,
      })
      .then(res => {
        const token: string = res.data.access_token;
        const roles: string[] = res.data.role_name;
        Cookies.set('roles', JSON.stringify(roles), { expires: 7 });
        Cookies.set('token', token, { expires: 7 });
        confirm('Đăng nhập thành công', token !== undefined, handleOk);
      })
      .catch(error => {
        const errorMessage =
          error.response?.data?.message || 'Có 1 lỗi xảy ra từ server';
        handleError(errorMessage);
      });

    setLoading(false);
  };

  const onFinishFailed = (errorInfo: any) => {
    setErrors(
      errorInfo.errorFields.reduce((acc: Record<string, string>, curr: any) => {
        acc[curr.name[0]] = curr.errors[0];
        return acc;
      }, {})
    );
  };
  return (
    <>
      <div
        style={{
          maxWidth: '400px',
          margin: '0 auto',
          marginTop: '100px',
          padding: '0.5rem',
          borderRadius: '0.5rem',
        }}
      >
        <div style={{ textAlign: 'center', margin: '10px', padding: '10px' }}>
          <Title level={2}>Booking Login</Title>
          <Text underline strong>
            {' '}
            Welcome to RikkeiSoft{' '}
          </Text>
        </div>
        <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}>
          <Form.Item
            name='email'
            rules={[
              { required: true, message: 'Email is required' },
              { type: 'email', message: 'Invalid email format' },
            ]}
            validateStatus={errors.email ? 'error' : ''}
            help={errors.email}
          >
            <Input
              prefix={<MailOutlined style={{ marginRight: '10px' }} />}
              placeholder='Email'
              allowClear
              style={{
                padding: '16px',
                fontSize: '16px',
                outline: 'none',
                border: 'none',
              }}
              disabled={loading}
            />
          </Form.Item>

          <Form.Item
            name='password'
            rules={[{ required: true, message: 'Password is required' }]}
            validateStatus={errors.password ? 'error' : ''}
            help={errors.password}
          >
            <Input.Password
              prefix={<LockOutlined style={{ marginRight: '10px' }} />}
              placeholder='Password'
              allowClear
              style={{
                padding: '16px',
                fontSize: '16px',
                outline: 'none',
                border: 'none',
              }}
              disabled={loading}
            />
          </Form.Item>

          <Form.Item style={{ fontSize: '50px' }}>
            <Button
              type='primary'
              htmlType='submit'
              block
              style={{
                padding: '20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '18px',
              }}
              disabled={loading}
            >
              {loading ? <Spin spinning={loading} /> : 'Log in'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default FormLogin;


