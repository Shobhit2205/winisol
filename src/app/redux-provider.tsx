'use client'

import { Provider } from 'react-redux';
// import { PersistGate } from 'redux-persist/integration/react';
import store from '../redux/store';
import { ReactNode } from 'react';


export function ReduxProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
        {/* <PersistGate loading={null} persistor={persistor}> */}
        {children}
        {/* </PersistGate> */}
    </Provider>
  )
}
