import React from 'react';
import { Form, Input, Button } from 'antd';
import { ValidateErrorEntity } from 'rc-field-form/lib/interface';
import { useAuth } from '../store';
import { Redirect, useHistory } from 'react-router';
import axios from 'axios';

const Login = () => {
  const history = useHistory();
  const auth = useAuth();

  const onFinish = (values: User) => {

      axios.post('/api/login', values)
      .then(res => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;

        if (auth) {
          auth.setUser(res.data.user);
          auth.setIsLogin(true);
        }

        history.push('/');
      })
      .catch(console.log);

  };

  const onFinishFailed = (errorInfo: ValidateErrorEntity<User>) => {
    console.log('Failed:', errorInfo);
  };

  if (auth) {
    if (auth.isLogin)
      return <Redirect exact to="/" />;
  }

  return (
    <Form
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Email"
        name="email"
        rules={[
          {
            required: true,
            message: 'Please input your username!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;