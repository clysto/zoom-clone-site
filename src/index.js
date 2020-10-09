import React from 'react';
import ReactDOM from 'react-dom';
import './styles/global.css';
import App from './App';
import { loginWithToken } from './api';
import { log } from 'pili-rtc-web';
import { SnackbarProvider } from 'notistack';

log.setLevel('disable');

const tokenCache = window.localStorage.getItem('token');
if (tokenCache) {
  loginWithToken(tokenCache);
}

ReactDOM.render(
  <SnackbarProvider
    maxSnack={3}
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
  >
    <App />
  </SnackbarProvider>,
  document.getElementById('root')
);
