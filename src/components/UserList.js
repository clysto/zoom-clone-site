import {
  Dialog,
  DialogTitle,
  ListItemText,
  List,
  ListItem,
  Avatar,
  ListItemAvatar,
  makeStyles,
} from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import { observer } from 'mobx-react';
import React from 'react';
import { blue } from '@material-ui/core/colors';

const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
});

export default observer(function UserList({ roomStore, open, onClose }) {
  const classes = useStyles();
  return (
    <Dialog
      open={open}
      maxWidth="xs"
      fullWidth
      onClose={onClose}
      scroll="paper"
    >
      <DialogTitle>参会人员</DialogTitle>
      <List>
        {Object.keys(roomStore.users).map((userId) => (
          <ListItem key={userId}>
            <ListItemAvatar>
              <Avatar className={classes.avatar}>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={roomStore.users[userId]} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
});
