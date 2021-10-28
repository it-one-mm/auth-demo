import React from 'react'
import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';

type AuthContextValueType = {
  user: AuthUser | null,
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>,
  isLogin: boolean,
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>,
}

const AuthContext = createContext<AuthContextValueType | null>(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = (props: React.PropsWithChildren<{}>) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [working, setWorking] = useState(true);
  const [isLogin, setIsLogin] = useState(false);

  const refreshToken = () => {
      axios.post('/refresh-token')
      .then((res) => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;

        setIsLogin(true);

        // silent refresh
        const expires_in = res.data.expires_in;
        setTimeout(() => {
          refreshToken()
        }, (expires_in * 1000) - 500);

        axios.get('/user')
          .then(res => {
            setUser(res.data.user);
          })
          .catch(console.log);
       
      })
      .catch(console.log)
      .finally(() => {
        setWorking(false);
      });
  }

  useEffect(() => {
    refreshToken();
  }, []);

  return <AuthContext.Provider {...props} value={{user, setUser, isLogin, setIsLogin}}>{ working ? null : props.children }</AuthContext.Provider>;
}