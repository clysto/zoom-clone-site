import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import RoomPage from './pages/RoomPage';
import SignupPage from './pages/SignupPage';
import CssBaseline from '@material-ui/core/CssBaseline';

function App() {
  return (
    <Router>
      <CssBaseline />
      <Switch>
        <Route path="/" exact>
          <Redirect to="/dashboard" />
        </Route>
        <ProtectedRoute path="/dashboard">
          <DashboardPage />
        </ProtectedRoute>
        <Route path="/login">
          <LoginPage />
        </Route>
        <Route path="/signup">
          <SignupPage />
        </Route>
        <ProtectedRoute path="/room/:roomId">
          <RoomPage />
        </ProtectedRoute>
      </Switch>
    </Router>
  );
}

export default App;
