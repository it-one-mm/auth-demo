import axios, { AxiosInstance } from "axios";
import React, { useContext, useEffect, useState, createContext } from "react";

type ProviderValue = AxiosInstance; 

type DefaultValue = null;

type ContextValue = DefaultValue | ProviderValue;

export const ClientContext = createContext<ContextValue>(null);

export const useClient = () => useContext(ClientContext);

export const ClientProvider = (props: React.PropsWithChildren<{}>) => {
  const [client, setClient] = useState<AxiosInstance | null>(null);

  useEffect(() => {
    const instance: AxiosInstance = axios.create({
      baseURL: 'http://auth.test/api',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    setClient(instance);
  }, []);
  
  return <ClientContext.Provider {...props} value={client}>{props.children}</ClientContext.Provider>
}