import React from 'react';
import './App.css';
import {
  Table,
  Paper,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  ButtonGroup,
  Dialog,
  DialogTitle,
  Input,
  FormLabel,
  TablePagination,
} from '@material-ui/core';
import download from 'downloadjs';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFiles: '',
      files: [],
      open: false,
      page: 0,
      rowsPerPage: 10,
    };
  }

  componentDidMount() {
    fetch('http://localhost:8000/file')
      .then((result) => result.json())
      .then((result) => {
        this.setState({
          files: result,
        });
      });
  }

  handleChangePage(event, newPage) {
    this.setState({ page: newPage });
  }

  handleChangeRowsPerPage(event) {
    this.setState({
      rowsPerPage: event.target.value,
      page: 0,
    });
  }

  selectFiles(event) {
    this.setState({
      selectedFiles: event.target.files,
    });
  }

  openDialog() {
    this.setState({ open: true });
  }

  closeDialog() {
    this.setState({ open: false });
  }

  async deleteFile(id, i) {
    const { files } = this.state;
    files.splice(i, 1);
    this.setState({ files });
    await fetch(`http://localhost:8000/file/${id}`, { method: 'DELETE' });
  }

  async downloadFile(file) {
    const res = await fetch(`http://localhost:8000/file/${file.id}`);
    const blob = await res.blob();
    download(blob, `${file.filename}.${file.extension}`);
  }

  async uploadFile(event) {
    const { selectedFiles } = this.state;
    event.preventDefault();
    const formData = new FormData();
    for (const key of Object.keys(selectedFiles)) {
      formData.append('file', selectedFiles[key]);
    }
    await fetch('http://localhost:8000/file', {
      method: 'POST',
      body: formData,
    });
    this.componentDidMount();
  }

  render() {
    const {
      selectedFiles, open, files, page, rowsPerPage,
    } = this.state;
    return (
      <Paper>
        <Dialog size="large" open={open}>
          <DialogTitle>Choose files</DialogTitle>
          <FormLabel>
            <Input type="file" inputProps={{ multiple: true }} onChange={this.selectFiles.bind(this)} />
          </FormLabel>
          <ButtonGroup variant="outlined" aria-label="outlined button group" fullWidth>
            <Button size="large" disabled={!selectedFiles} onClick={this.uploadFile.bind(this)}>Upload</Button>
            <Button size="large" onClick={this.closeDialog.bind(this)}>Close</Button>
          </ButtonGroup>
        </Dialog>
        <Table>
          <TableHead>
            <TableCell align="center" colSpan={5}>
              <Button color="primary" variant="contained" size="large" onClick={this.openDialog.bind(this)}>Upload</Button>
            </TableCell>
          </TableHead>
          <TableHead>
            <TableRow>
              <TableCell align="center">Id</TableCell>
              <TableCell align="center">Filename</TableCell>
              <TableCell align="center">Extension</TableCell>
              <TableCell align="center">Upload date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {files
              .sort((a, b) => b.id - a.id)
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((file, i) => {
                const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
                const date = new Date(file.date).toLocaleString('en-US', { timeZone: tz });
                return (
                  <TableRow key={`row-${i}`}>
                    <TableCell align="center">{file.id}</TableCell>
                    <TableCell align="center">{file.filename}</TableCell>
                    <TableCell align="center">{file.extension}</TableCell>
                    <TableCell align="center">{date}</TableCell>
                    <TableCell align="center">
                      <Button
                        onClick={this.downloadFile.bind(this, file)}
                        color="success"
                      >
                        Download
                      </Button>
                      <Button
                        onClick={this.deleteFile.bind(this, file.id, i + page * rowsPerPage)}
                        color="error"
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 20, 25]}
          count={files.length}
          component="div"
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={this.handleChangePage.bind(this)}
          onRowsPerPageChange={this.handleChangeRowsPerPage.bind(this)}
        />
      </Paper>
    );
  }
}
export default App;
