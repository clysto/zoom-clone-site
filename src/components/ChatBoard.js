import React, { useEffect, useState, useRef } from 'react';
import { observer } from 'mobx-react';
import { Box, makeStyles, TextField, Button, Avatar } from '@material-ui/core';
import { blue, grey } from '@material-ui/core/colors';
import clx from 'classnames';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
    overflow: 'hidden',
  },
  msgBox: {
    backgroundColor: blue[100],
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
  },
  me: {
    float: 'right',
  },
  control: {
    borderTop: `1px solid ${grey[300]}`,
  },
}));

export default observer(function ({ roomStore }) {
  const classes = useStyles();
  const msgRef = useRef(null);

  const [msgContent, setMsgContent] = useState('');

  const sendMsg = () => {
    if (msgContent) {
      roomStore.sendMessage(msgContent);
      setMsgContent('');
    }
  };

  useEffect(() => {
    msgRef.current.scrollIntoView();
  });

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMsg();
    }
  };

  return (
    <Box display="flex" flexDirection="column" className={classes.root}>
      <Box flex="1" overflow="auto" p={2}>
        {roomStore.messages.map((msg, index) => (
          <Box key={index} display="flex" mb={1}>
            {!msg.me && <Avatar>{msg.username[0]}</Avatar>}
            <Box mx={1} flex="1">
              <Box
                mb={1}
                color="text.secondary"
                textAlign={msg.me ? 'right' : 'left'}
              >
                {msg.username}
              </Box>
              <Box
                p={1}
                className={clx(classes.msgBox, {
                  [classes.me]: msg.me,
                })}
                display="inline-block"
              >
                {msg.data}
              </Box>
            </Box>
            {msg.me && <Avatar>{msg.username[0]}</Avatar>}
          </Box>
        ))}
        <Box ref={msgRef}></Box>
      </Box>
      <Box p={2} className={classes.control}>
        <Box mb={1}>
          <TextField
            value={msgContent}
            onChange={(e) => setMsgContent(e.target.value)}
            rowsMax={8}
            multiline
            variant="outlined"
            fullWidth
            onKeyPress={handleKeyPress}
          ></TextField>
        </Box>
        <Box>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={sendMsg}
          >
            发送
          </Button>
        </Box>
      </Box>
    </Box>
  );
});
