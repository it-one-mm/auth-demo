import { Button } from 'antd';
import axios from 'axios';
import React from 'react'
import { Redirect, useHistory } from 'react-router';
import { useAuth } from '../store'

const Dashboard = () => {

  const auth = useAuth();
  const history = useHistory();

  const logout = () => {

      axios.post('/api/logout')
      .then(res => { 
        console.log(res);
        
      })
      .catch(console.log)
      .finally(() => {
        history.push('/login');

        auth?.setIsLogin(false);
        auth?.setUser(null);        
      });

  }

  if (auth) {
    if (!(auth.isLogin)) {
      return <Redirect to='/login' />
    }
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <Button type="primary" onClick={logout}>Logout</Button>
    </div>
  )
}

export default Dashboard
