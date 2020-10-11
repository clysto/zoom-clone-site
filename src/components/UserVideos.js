import React from 'react';
import VideoPlayer from './VideoPlayer';
import Box from '@material-ui/core/Box';
import {
  GridList,
  GridListTileBar,
  GridListTile,
  useMediaQuery,
  IconButton,
  useTheme,
} from '@material-ui/core';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import { makeStyles } from '@material-ui/core';
import { observer } from 'mobx-react';

const useStyles = makeStyles((theme) => ({
  videoList: {
    width: '100%',
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
}));

export default observer(function UserVideo({ roomStore }) {
  const classes = useStyles();
  const theme = useTheme();
  const cols = useMediaQuery(theme.breakpoints.down('sm')) ? 1 : 2;

  const enterFullScreen = (track) => {
    if (track.mediaElement) {
      if (track.mediaElement.requestFullscreen) {
        track.mediaElement.requestFullscreen();
      } else if (track.mediaElement.mozRequestFullScreen) {
        track.mediaElement.mozRequestFullScreen();
      } else if (track.mediaElement.webkitRequestFullscreen) {
        track.mediaElement.webkitRequestFullscreen();
      } else if (track.mediaElement.msRequestFullscreen) {
        track.mediaElement.msRequestFullscreen();
      }
    }
  };

  return (
    <Box display="flex" overflow="hidden" justifyContent="space-around">
      <GridList
        cellHeight="auto"
        className={classes.videoList}
        cols={cols}
        spacing={0}
      >
        {roomStore.allVidTracks.map((track) => (
          <GridListTile key={track.info.trackId}>
            <VideoPlayer track={track}></VideoPlayer>
            <GridListTileBar
              title={roomStore.users[track.userId]}
              actionIcon={
                <IconButton
                  className={classes.icon}
                  onClick={() => enterFullScreen(track)}
                >
                  <FullscreenIcon />
                </IconButton>
              }
            />
          </GridListTile>
        ))}
      </GridList>
    </Box>
  );
});
