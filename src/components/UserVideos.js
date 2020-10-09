import React from 'react';
import VideoPlayer from './VideoPlayer';
import Box from '@material-ui/core/Box';
import {
  GridList,
  GridListTileBar,
  GridListTile,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import { observer } from 'mobx-react';

const useStyles = makeStyles((theme) => ({
  videoList: {
    width: '100%',
  },
}));

export default observer(function UserVideo({ roomStore }) {
  const classes = useStyles();
  const theme = useTheme();
  const cols = useMediaQuery(theme.breakpoints.down('sm')) ? 1 : 2;

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
            <GridListTileBar title={roomStore.users[track.userId]} />
          </GridListTile>
        ))}
      </GridList>
    </Box>
  );
});
