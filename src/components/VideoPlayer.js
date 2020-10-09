import { Box, makeStyles } from '@material-ui/core';
import React, { useRef, useEffect } from 'react';

const useStyles = makeStyles({
  vid: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    '& video': {
      objectFit: 'cover !important',
    },
  },
  vidWrapper: {
    height: 0,
    width: '100%',
    paddingTop: '56.25%',
    position: 'relative',
  },
});

export default function VideoPlayer({ track }) {
  const vidRef = useRef(null);
  const classes = useStyles();

  useEffect(() => {
    track.play(vidRef.current, true);
  }, [track]);

  return (
    <Box>
      <Box className={classes.vidWrapper}>
        <div ref={vidRef} className={classes.vid}></div>
      </Box>
    </Box>
  );
}
