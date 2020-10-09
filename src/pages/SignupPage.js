import React from 'react';
import Box from '@material-ui/core/Box';
import TextFiled from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { login, signup } from '../api';
import { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const history = useHistory();

  const handleClick = async () => {
    try {
      await signup(username, password);
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

  const cancelInput = () => {
    setUsername('');
    setPassword('');
    setErrorMsg('');
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <Box mx="auto" width="400px" display="flex" flexDirection="column" p={2}>
        <Box
          my={1}
          textAlign="center"
          fontSize="36px"
          fontWeight="bold"
          fontFamily="Fredoka One, cursive"
        >
          Signup
        </Box>
        <Box my={1}>
          <TextFiled
            value={username}
            variant="outlined"
            label="用户名"
            size="small"
            fullWidth
            helperText={errorMsg}
            error={!!errorMsg}
            onChange={handleUsernameChange}
          />
        </Box>
        <Box my={1}>
          <TextFiled
            variant="outlined"
            label="密码"
            type="password"
            size="small"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Box>
        <Box my={1}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleClick}
          >
            注册
          </Button>
        </Box>
        <Box my={1}>
          <Button variant="contained" fullWidth onClick={cancelInput}>
            重置
          </Button>
        </Box>
        <Box py={2} textAlign="center" color="text.secondary">
          <Link to="/login">已经有账号？去登陆。</Link>
        </Box>
      </Box>
    </Box>
  );
}
