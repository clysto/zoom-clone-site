import React, { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import {
  makeStyles,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Avatar,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Divider,
  Chip,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import {
  getUserRooms,
  createRoom,
  getCurrentUser,
  closeRoom,
  deleteRoom,
  logout,
} from '../api';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import VideoCallIcon from '@material-ui/icons/VideoCall';
import DeleteIcon from '@material-ui/icons/Delete';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { grey } from '@material-ui/core/colors';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
  dialog: {
    width: '400px',
  },
  main: {
    maxWidth: '400px',
    margin: '0 auto',
    height: '100%',
  },
  avatar: {
    width: '80px',
    height: '80px',
    fontSize: '30px',
  },
  roomItem: {
    transition: '200ms',
    '&:hover': {
      backgroundColor: grey[100],
    },
  },
  roomList: {
    backgroundColor: 'transparent',
  },
  dangerButton: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.error.dark,
    },
  },
}));

export default function DashboardPage() {
  const [roomId, setRoomId] = useState('');
  const [subject, setSubject] = useState('');
  const [allRooms, setAllRooms] = useState([]);
  const [joinRoomDialog, setJoinRoomDialog] = useState(false);
  const [createRoomDialog, setCreateRoomDialog] = useState(false);
  const classes = useStyles();
  const [user, setUser] = useState({ username: '' });
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    (async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      const rooms = await getUserRooms();
      setAllRooms(rooms);
    })();
  }, []);

  const gotoRoom = () => {
    history.push(`/room/${roomId}`);
  };

  const reJoinRoom = (roomId) => {
    history.push(`/room/${roomId}`);
  };

  const createNewRoom = async () => {
    const newRoom = await createRoom(subject);
    history.push(`/room/${newRoom._id}`);
  };

  const onCloseRoom = async (roomId) => {
    await closeRoom(roomId);
    allRooms.forEach((room) => {
      if (room._id === roomId) {
        room.closed = true;
      }
    });
    setAllRooms([...allRooms]);
  };

  const onLogout = () => {
    logout();
    history.push('/');
  };

  const onDeleteRoom = async (roomId) => {
    await deleteRoom(roomId);
    setAllRooms(allRooms.filter((room) => room._id !== roomId));
    enqueueSnackbar('会议记录删除', { variant: 'success' });
  };

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Box py={4} px={2} height="100vh">
      <Box className={classes.main} display="flex" flexDirection="column" p={2}>
        <Box pb={2}>
          <Box my={1} display="flex" flexDirection="column" alignItems="center">
            <Avatar className={classes.avatar}>{user.username[0]}</Avatar>
            <Box mt={2}>
              <Chip
                label={user.username}
                avatar={<Avatar>{user.username[0]}</Avatar>}
              ></Chip>
            </Box>
          </Box>
          <Box my={2}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={() => setCreateRoomDialog(true)}
              startIcon={<MeetingRoomIcon />}
            >
              快速会议
            </Button>
          </Box>
          <Box my={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setJoinRoomDialog(true)}
              fullWidth
              size="large"
              startIcon={<VideoCallIcon />}
            >
              加入会议
            </Button>
          </Box>
          <Box my={2}>
            <Button
              variant="contained"
              className={classes.dangerButton}
              onClick={onLogout}
              fullWidth
              size="large"
              startIcon={<ExitToAppIcon />}
            >
              退出账号
            </Button>
          </Box>
        </Box>
        <Divider />
        <Box flex="1" overflow="auto">
          <Box color="text.secondary" my={2}>
            我创建的会议
          </Box>
          <Box>
            {allRooms.map((roomInfo) => {
              return (
                <Accordion
                  elevation={0}
                  className={classes.roomItem}
                  key={roomInfo._id}
                  classes={{ root: classes.roomList }}
                >
                  <AccordionSummary color="transparent">
                    <Box>
                      <Typography variant="subtitle2">
                        {roomInfo.subject}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {roomInfo.closed
                          ? '会议已结束'
                          : new Date(roomInfo.createdDate).toLocaleString()}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    {!roomInfo.closed ? (
                      <ButtonGroup
                        size="small"
                        variant="contained"
                        color="primary"
                      >
                        <Button onClick={() => reJoinRoom(roomInfo._id)}>
                          重新入会
                        </Button>
                        <Button onClick={() => onCloseRoom(roomInfo._id)}>
                          结束会议
                        </Button>
                      </ButtonGroup>
                    ) : (
                      <Button
                        variant="contained"
                        className={classes.dangerButton}
                        startIcon={<DeleteIcon />}
                        size="small"
                        onClick={() => onDeleteRoom(roomInfo._id)}
                      >
                        删除会议
                      </Button>
                    )}
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Box>
        </Box>
      </Box>
      <Dialog
        maxWidth="xs"
        fullWidth
        open={createRoomDialog}
        fullScreen={fullScreen}
      >
        <DialogTitle>创建会议</DialogTitle>
        <DialogContent>
          <DialogContentText>输入会议主题</DialogContentText>
          <TextField
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            autoFocus
            margin="dense"
            fullWidth
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button color="primary" variant="contained" onClick={createNewRoom}>
            创建
          </Button>
          <Button color="primary" onClick={() => setCreateRoomDialog(false)}>
            取消
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={joinRoomDialog}
        maxWidth="xs"
        fullWidth
        fullScreen={fullScreen}
      >
        <DialogTitle>加入会议</DialogTitle>
        <DialogContent>
          <DialogContentText>输入会议室号码快速加入会议</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            onChange={(e) => setRoomId(e.target.value)}
            fullWidth
            variant="outlined"
            value={roomId}
          />
        </DialogContent>
        <DialogActions>
          <Button color="primary" variant="contained" onClick={gotoRoom}>
            加入
          </Button>
          <Button color="primary" onClick={() => setJoinRoomDialog(false)}>
            取消
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
