import React from 'react';
import {
  Button,
  ButtonGroup,
  Dialog,
  DialogTitle,
  Input,
  FormLabel,
} from '@mui/material';

class DialogBox extends React.Component {

  render() {
    const { selectFiles, uploadFile, closeDialog, open, selectedFiles } = this.props;
    return (
        <Dialog size="large" open={open}>
          <DialogTitle>Choose files</DialogTitle>
          <FormLabel>
            <Input type="file" inputProps={{ multiple: true }} onChange={selectFiles} />
          </FormLabel>
          <ButtonGroup variant="outlined" aria-label="outlined button group" fullWidth>
            <Button size="large" disabled={!selectedFiles} onClick={uploadFile}>Upload</Button>
            <Button size="large" onClick={closeDialog}>Close</Button>
          </ButtonGroup>
        </Dialog>
    );
  }
}
export default DialogBox;
