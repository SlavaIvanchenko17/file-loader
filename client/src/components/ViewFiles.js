import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Typography,
  IconButton
} from '@mui/material';
import download from 'downloadjs';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

class ViewFiles extends React.Component {
  constructor(props) {
    super(props);
    this.link = 'http://localhost:8080';
    this.lineItems = {};
    this.state = {
      lineItems: {},
      expandedRows: []
    };
  }

  handleRowClick(rowId) {
    const currentExpandedRows = this.state.expandedRows;
    const isRowCurrentlyExpanded = currentExpandedRows.includes(rowId);
    
    const newExpandedRows = isRowCurrentlyExpanded ? 
    currentExpandedRows.filter(id => id !== rowId) : 
    currentExpandedRows.concat(rowId);
    
    this.setState({
      expandedRows : newExpandedRows,
    });
  }

  async downloadFile(file) {
    const res = await fetch(`${this.link}/file/${file.id}`);
    const blob = await res.blob();
    download(blob, `${file.filename}.${file.extension}`);
  }

  getLineItems(id, extension) {
    if(extension !== 'csv') {
      return;
    }

    if(Object.keys(this.state.lineItems).includes(String(id))){
      this.setState({
        headers: this.state.lineItems[id].headers,
        rows: this.state.lineItems[id].rows,
      });
      this.handleRowClick(id);
    } else {
      fetch(`${this.link}/lineitems/${id}`)
      .then((result) => result.json())
      .then((result) => {
        const items = JSON.parse(result.items);
        this.lineItems[id] = {
          headers: items.headers,
          rows: items.row
        }
        this.setState({
          lineItems: this.lineItems                             
        });
        this.handleRowClick(id);
      });
    }
   }

  render() {
    const { lineItems, expandedRows } = this.state;
    const { files, page, rowsPerPage, deleteFile } = this.props;
    return (
          <TableBody>
            {files
              .sort((a, b) => b.id - a.id)
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((file, i) => {
                const { id, filename, extension, date } = file;
                const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
                const outputDate = new Date(date).toLocaleString('en-US', { timeZone: tz });
                const itemsRows = [
                  <TableRow key={`row-${id}`}>
                    <TableCell>
                    {<IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={this.getLineItems.bind(this, id, extension)}>
                    {(expandedRows.includes(id)) ? <KeyboardArrowDownIcon/> : <KeyboardArrowUpIcon/>}
                    </IconButton>}
                    </TableCell>
                    <TableCell align="center">{id}</TableCell>
                    <TableCell align="center">{filename}</TableCell>
                    <TableCell align="center">{extension}</TableCell>
                    <TableCell align="center">{outputDate}</TableCell>
                    <TableCell align="center">
                      <Button
                        onClick={this.downloadFile.bind(this, file)}
                        color="success"
                      >
                        Download
                      </Button>
                      <Button
                        onClick={deleteFile.bind(this, files, id, i + page * rowsPerPage)}
                        color="error"
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ];

                if(expandedRows.includes(id)) {
                  itemsRows.push(
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Typography variant="h5">
                          CSV Data
                        </Typography>
                           <Table size="small">
                              <TableHead>
                                <TableRow>
                                {lineItems[id].headers.map(header => {
                                  return (<TableCell>{header.name}</TableCell>);
                                })}
                                </TableRow>
                              </TableHead>
                              <TableBody>
                              {lineItems[id].rows.map(row => {
                              return (
                                <TableRow>
                                  {lineItems[id].headers.map(header => {
                                    const value = row[header.id].value;
                                    return ((<TableCell>{value}</TableCell>));
                                  })}
                                </TableRow>);
                              })}
                              </TableBody>
                           </Table>
                      </TableCell>
                    </TableRow>
                  );
                }
                return itemsRows;
              })}
          </TableBody>
    );
  }
}
export default ViewFiles;
