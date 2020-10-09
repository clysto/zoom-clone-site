import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';

export default function ConfirmDialog({
  title,
  contentText,
  confirmButtonText,
  cancelButtonText,
  open,
  onConfirm,
  onCancel,
}) {
  return (
    <Dialog maxWidth="xs" fullWidth open={open}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{contentText}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="primary" variant="contained" onClick={onConfirm}>
          {confirmButtonText}
        </Button>
        <Button onClick={onCancel}>{cancelButtonText}</Button>
      </DialogActions>
    </Dialog>
  );
}
