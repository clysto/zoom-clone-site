import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextFiled from '@material-ui/core/TextField';
import { login } from '../api';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';

const useStyles = makeStyles({
  form: {
    margin: '0 auto',
    width: '400px',
  },
  root: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function LoginPage() {
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleClick = async () => {
    try {
      const data = await login(username, password);
      if (data) {
        history.push('/dashboard');
      }
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleUsernameChange = (e) => {
    if (errorMsg) setErrorMsg('');
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    if (errorMsg) setErrorMsg('');
    setPassword(e.target.value);
  };

  const cancelInput = () => {
    setUsername('');
    setPassword('');
    setErrorMsg('');
  };

  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <Box className={classes.form} display="flex" flexDirection="column" p={2}>
        <Box
          my={1}
          fontWeight="bold"
          fontSize={36}
          textAlign="center"
          fontFamily="Fredoka One, cursive"
        >
          Login
        </Box>
        <Box my={1}>
          <TextFiled
            label="用户名"
            variant="outlined"
            size="small"
            fullWidth
            value={username}
            error={!!errorMsg}
            onChange={handleUsernameChange}
          />
        </Box>
        <Box my={1}>
          <TextFiled
            error={!!errorMsg}
            helperText={errorMsg}
            label="密码"
            variant="outlined"
            type="password"
            size="small"
            fullWidth
            value={password}
            onChange={handlePasswordChange}
          />
        </Box>
        <Box my={1}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleClick}
          >
            登陆
          </Button>
        </Box>
        <Box my={1}>
          <Button variant="contained" fullWidth onClick={cancelInput}>
            重置
          </Button>
        </Box>
        <Box py={2} textAlign="center" color="text.secondary">
          <Link to="/signup">还没有账号？现在去注册。</Link>
        </Box>
      </Box>
    </Box>
  );
}
