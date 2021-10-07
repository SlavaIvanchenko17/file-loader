import React from 'react';
import {
  Table,
  Paper,
  TableCell,
  TableHead,
  TableRow,
  Button,
  TablePagination,
} from '@mui/material';
import DialogBox from './components/Dialog';
import ViewFiles from './components/ViewFiles';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.link = 'http://localhost:8080';
    this.selectFiles = this.selectFiles.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.openDialog = this.openDialog.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    this.state = {
      selectedFiles: '',
      files: [],
      open: false,
      page: 0,
      rowsPerPage: 10,
    };
  }

  componentDidMount() {
    fetch(`${this.link}/file`)
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

  async deleteFile(files, id, i) {
    files.splice(i, 1);
    this.setState({ files });
    await fetch(`${this.link}/file/${id}`, { method: 'DELETE' });
  }

  async uploadFile(event) {
    const { selectedFiles } = this.state;
    event.preventDefault();
    const formData = new FormData();
    for (const key of Object.keys(selectedFiles)) {
      formData.append('file', selectedFiles[key]);
    }
    await fetch(`${this.link}/file`, {
      method: 'POST',
      body: formData,
    });
    this.componentDidMount();
    this.closeDialog();
  }

  render() {
    const { 
      selectedFiles, open, files, page, rowsPerPage
    } = this.state;
    return (
      <Paper>
        <DialogBox 
          selectFiles={this.selectFiles}
          uploadFile={this.uploadFile}
          closeDialog={this.closeDialog}
          selectedFiles={selectedFiles}
          open={open}/>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableCell align="center" colSpan={6}>
              <Button color="primary" variant="contained" size="large" onClick={this.openDialog}>Upload</Button>
            </TableCell>
          </TableHead>
          <TableHead>
            <TableRow>
              <TableCell/>
              <TableCell align="center">Id</TableCell>
              <TableCell align="center">Filename</TableCell>
              <TableCell align="center">Extension</TableCell>
              <TableCell align="center">Upload date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <ViewFiles files={files} page={page} rowsPerPage={rowsPerPage} deleteFile={this.deleteFile}/>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 20, 25]}
          count={files.length}
          component="div"
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={this.handleChangePage}
          onRowsPerPageChange={this.handleChangeRowsPerPage}
        />
      </Paper>
    );
  }
}
export default App;
