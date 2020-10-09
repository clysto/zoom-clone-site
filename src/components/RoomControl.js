import React, { useState } from 'react';
import { observer } from 'mobx-react';
import UserList from './UserList';
import {
  makeStyles,
  Button,
  ButtonGroup,
  Hidden,
  Box,
} from '@material-ui/core';
import {
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Videocam as VideocamIcon,
  VideocamOff as VideocamOffIcon,
  People as PeopleIcon,
  ExitToApp as ExitToAppIcon,
  ScreenShare as ScreenShareIcon,
  StopScreenShare as StopScreenShareIcon,
} from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
  leaveButton: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.error.dark,
    },
  },
}));

export default observer(function RoomControl({ roomStore }) {
  const [userListOpen, setUserListOpen] = useState(false);
  const history = useHistory();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const leaveRoom = () => {
    roomStore.leaveRoom();
    history.push('/dashboard');
  };

  const toggleCamera = () => {
    roomStore.muteLocalTrack('camera');
  };

  const toggleMic = () => {
    roomStore.muteLocalTrack('audio');
  };

  const shareScreen = async () => {
    try {
      await roomStore.toggleScreenShare();
    } catch (err) {
      enqueueSnackbar(err.message, {
        variant: 'warning',
        preventDuplicate: true,
      });
    }
  };

  return (
    <Box p={2} className={classes.bottomBar} display="flex">
      <Hidden smDown>
        <ButtonGroup color="primary" variant="contained">
          <Button
            onClick={toggleCamera}
            startIcon={
              roomStore.cameraOn ? <VideocamIcon /> : <VideocamOffIcon />
            }
          >
            {roomStore.cameraOn ? '关闭摄像头' : '开启摄像头'}
          </Button>
          <Button
            onClick={toggleMic}
            startIcon={roomStore.micOn ? <MicIcon /> : <MicOffIcon />}
          >
            {roomStore.micOn ? '关闭麦克风' : '开启麦克风'}
          </Button>
          <Button
            onClick={() => setUserListOpen(true)}
            startIcon={<PeopleIcon />}
          >
            参会人员
          </Button>
          <Button
            startIcon={
              roomStore.screenTrack ? (
                <ScreenShareIcon />
              ) : (
                <StopScreenShareIcon />
              )
            }
            onClick={shareScreen}
          >
            {roomStore.screenTrack ? '关闭屏幕共享' : '开启屏幕共享'}
          </Button>
        </ButtonGroup>
      </Hidden>
      <Box flex="1" />
      <Button
        variant="contained"
        className={classes.leaveButton}
        onClick={leaveRoom}
        startIcon={<ExitToAppIcon />}
      >
        退出会议
      </Button>
      <UserList
        open={userListOpen}
        roomStore={roomStore}
        onClose={() => {
          setUserListOpen(false);
        }}
      />
    </Box>
  );
});
