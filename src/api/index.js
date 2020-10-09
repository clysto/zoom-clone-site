import axios from 'axios';

let loginState = false;

export async function login(username, password) {
  if (!username || !password) return false;
  try {
    const res = await axios.post('/api/login', {
      username,
      password,
    });
    window.localStorage.setItem('token', res.data.token);
    axios.defaults.headers.common = {
      Authorization: `Bearer ${res.data.token}`,
    };
    loginState = true;
    return true;
  } catch (err) {
    throw new Error(err.response.data.error);
  }
}

export async function signup(username, password) {
  try {
    const res = await axios.post('/api/signup', {
      username,
      password,
    });
    return res.data;
  } catch (err) {
    throw new Error(
      err.response.data.error || '用户名只能含有字母、下划线和中划线'
    );
  }
}

export async function createRoom(subject) {
  try {
    const data = (
      await axios.post('/api/rooms', {
        subject,
      })
    ).data;
    return data;
  } catch (err) {
    return null;
  }
}

export function loginWithToken(token) {
  window.localStorage.setItem('token', token);
  axios.defaults.headers.common = {
    Authorization: `Bearer ${token}`,
  };
  loginState = true;
  return true;
}

export function isLogin() {
  return loginState;
}

export function logout() {
  window.localStorage.removeItem('token');
  loginState = false;
}

export async function getRoomToken(roomId) {
  try {
    const res = await axios.get(`/api/rooms/${roomId}/token`);
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function getCurrentUser() {
  try {
    const res = await axios.get('/api/user');
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function getRoomAndToken(roomId) {
  try {
    const res = await axios.get(`/api/rooms/${roomId}/token`);
    return res.data;
  } catch (err) {
    return null;
  }
}

export function appendVideo(track, container, muted) {
  track.play(container, muted);
}

export async function getUserRooms() {
  try {
    return (await axios.get('/api/rooms')).data;
  } catch (err) {
    return [];
  }
}

export async function closeRoom(roomId) {
  const res = await axios.put(`/api/rooms/${roomId}/closed`);
  return res.data;
}

export async function deleteRoom(roomId) {
  await axios.delete(`/api/rooms/${roomId}`);
}
