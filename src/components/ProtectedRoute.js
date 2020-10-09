import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { isLogin } from '../api';

export default function ProtectedRoute(props) {
  return (
    <Route
      path={props.path}
      render={() => {
        if (isLogin()) {
          return props.children;
        } else {
          return <Redirect to={'/login'} />;
        }
      }}
    ></Route>
  );
}
