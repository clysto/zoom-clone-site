import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  makeStyles,
  Box,
  AppBar,
  Toolbar,
  Chip,
  Typography,
  Hidden,
} from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import RoomControl from '../components/RoomControl';
import UserVideos from '../components/UserVideos';
import UserAudios from '../components/UserAudios';
import RoomStore from '../stores/RoomStore';
import ChatBoard from '../components/ChatBoard';
import ConfirmDialog from '../components/ConfirmDialog';
import { observer } from 'mobx-react';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  main: {
    height: '100vh',
    overflow: 'hidden',
  },
  title: {
    fontFamily: 'Fredoka One, cursive',
  },
  bottomBar: {
    backgroundColor: 'transparent',
    borderTop: `1px solid ${grey[300]}`,
  },
  chatList: {
    width: 300,
    borderLeft: `1px solid ${grey[300]}`,
  },
  appBar: {
    borderBottom: `1px solid ${grey[300]}`,
  },
}));

export default observer(function RoomPage() {
  const classes = useStyles();
  const history = useHistory();
  const [confirmJoin, setConfirmJoin] = useState(false);
  const { roomId } = useParams();
  const [roomStore] = useState(new RoomStore());
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (confirmJoin) {
      (async () => {
        try {
          await roomStore.joinRoom(roomId);
          // 初始化房间
          await roomStore.init();
        } catch (err) {
          enqueueSnackbar(err.message, { variant: 'error' });
          history.push('/dashboard');
          return;
        }
      })();
      return () => {
        roomStore.leaveRoom();
      };
    }
  }, [roomId, history, roomStore, confirmJoin, enqueueSnackbar]);

  return (
    <>
      {confirmJoin ? (
        <Box display="flex">
          <Box
            className={classes.main}
            display="flex"
            flexDirection="column"
            flex={1}
          >
            <AppBar
              position="static"
              color="transparent"
              elevation={0}
              className={classes.appBar}
            >
              <Toolbar>
                <Typography variant="h6" className={classes.title}>
                  Zoom Clone
                </Typography>
                <Box flex="1"></Box>
                <Box ml={2}>
                  {roomStore.roomName && (
                    <Chip
                      variant="outlined"
                      label={'会议主题:' + roomStore.roomName}
                      size="small"
                    ></Chip>
                  )}
                </Box>
              </Toolbar>
            </AppBar>
            <Box flex="1">
              <UserVideos roomStore={roomStore} />
            </Box>
            <UserAudios roomStore={roomStore} />
            <Box className={classes.bottomBar}>
              <RoomControl roomStore={roomStore} />
            </Box>
          </Box>
          <Hidden smDown>
            <Box className={classes.chatList}>
              <ChatBoard roomStore={roomStore} />
            </Box>
          </Hidden>
        </Box>
      ) : (
        <ConfirmDialog
          title="加入会议房间"
          contentText="我们将采集您的摄像头/麦克风数据并与房间其他用户进行音视频通话"
          confirmButtonText="加入"
          cancelButtonText="取消"
          open={!confirmJoin}
          onConfirm={() => setConfirmJoin(true)}
          onCancel={() => history.push('/dashboard')}
        />
      )}
    </>
  );
});
