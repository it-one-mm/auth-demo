import React from 'react'
import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';

type AuthContextValueType = {
  user: AuthUser | null;
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
}

const AuthContext = createContext<AuthContextValueType | null>(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = (props: React.PropsWithChildren<{}>) => {

  // const client = useClient();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [working, setWorking] = useState(true);

  const refreshToken = () => {
    // if (client) {
      axios.post('/refresh-token')
      .then((res) => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;

        // silent refresh
        const expires_in = res.data.expires_in;
        setTimeout(() => {
          refreshToken()
        }, (expires_in * 1000) - 500);

        axios.get('/user')
          .then(res => {
            setUser(res.data.user);
          })
          .catch(console.log)
          .finally(() => {
            setWorking(false);
          });
       
      })
      .catch(console.log)
      .finally(() => {
        setWorking(false);
      });
    // }
  }

  useEffect(() => {
    refreshToken();
  }, []);

  return <AuthContext.Provider {...props} value={{user, setUser}}>{ working ? null : props.children }</AuthContext.Provider>;
}