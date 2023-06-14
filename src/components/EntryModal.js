import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import { useState } from 'react';
import { categories } from '../utils/categories';
import { addEntry, deleteEntry, updateEntry } from '../utils/mutations';


// Modal component for individual entries.

/* EntryModal parameters:
entry: Data about the entry in question
type: Type of entry modal being opened. 
   This can be "add" (for adding a new entry) or 
   "edit" (for opening or editing an existing entry from table).
user: User making query (The current logged in user). */

export default function EntryModal({ entry, type, user }) {

   // State variables for modal status

   // TODO: For editing, you may have to add and manage another state variable to check if the entry is being edited.

   const [open, setOpen] = useState(false);
   const [name, setName] = useState(entry.name);
   const [link, setLink] = useState(entry.link);
   const [description, setDescription] = useState(entry.description);
   const [category, setCategory] = React.useState(entry.category);
   const [editing, setEditing] = useState(false);
   // Modal visibility handlers

   const handleClickOpen = () => {
      setOpen(true);
      setName(entry.name);
      setLink(entry.link);
      setDescription(entry.description);
      setCategory(entry.category);
   };

   const handleClose = () => {
      setOpen(false);
   };

   // Add Mutation Handler

   const handleAdd = () => {
      const newEntry = {
         name: name,
         link: link,
         description: description,
         user: user?.displayName ? user?.displayName : "GenericUser",
         category: category,
         userid: user?.uid,
      };

      addEntry(newEntry).catch(console.error);
      handleClose();
   };

   // Edit Mutation Handler

    const handleEdit = () => {
      setEditing(!editing);

      const updatedEntry = {
         name: name,
         link: link,
         description: description,
         category: category,
         id: entry.id,
      };

      updateEntry(updatedEntry).catch(console.error);
      if (editing) {
         handleClose();
      }
    };

   // Delete Mutation Handler

   const handleDelete = () => {
      const id = entry.id;

      deleteEntry(id).catch(console.error);
      handleClose();
   };

   // Button handlers for modal opening and inside-modal actions.
   // These buttons are displayed conditionally based on if adding or editing/opening.

   const openButton =
      type === "edit" ? <IconButton onClick={handleClickOpen}>
         <OpenInNewIcon />
      </IconButton>
         : type === "add" ? <Button variant="contained" onClick={handleClickOpen}>
            Add entry
         </Button>
            : null;


   const actionButtons =
      type === "edit" ?
         <DialogActions>
            <Button color="error" onClick={handleDelete}>Delete</Button>
            <Button variant="contained" onClick={handleEdit}>{editing ? "Confirm" : "Edit"}</Button>
            <Button onClick={handleClose}>Cancel</Button>
         </DialogActions>
         : type === "add" ?
            <DialogActions>
               <Button onClick={handleClose}>Cancel</Button>
               <Button variant="contained" onClick={handleAdd}>Add Entry</Button>
            </DialogActions>
            : null;

   const qrCodeGenerator = 
      type === "edit" ?
      <DialogActions>
         <b>
            QR Code for {entry.link}:
         </b>
         <img
            style = {{padding: 20}}
            alt={"QR Code for " + entry.link}
            src={"http://api.qrserver.com/v1/create-qr-code/?data=" + entry.link +  "&size=200x200"}
         >
         </img>
      </DialogActions>
         : null;

   return (
      <div>
         <DialogActions>
            {openButton}
            <Dialog open={open} onClose={handleClose}>
               <DialogTitle>{type === "edit" ? name : "Add Entry"}</DialogTitle>
               <DialogContent>
                  <TextField
                     disabled = {type === "edit" ? !editing : false}
                     margin="normal"
                     id="name"
                     label="Name"
                     fullWidth
                     variant="standard"
                     value={name}
                     onChange={(event) => setName(event.target.value)}
                  />
                  <TextField
                     disabled = {type === "edit" ? !editing : false}
                     margin="normal"
                     id="link"
                     label="Link"
                     placeholder="e.g. https://google.com"
                     fullWidth
                     variant="standard"
                     value={link}
                     onChange={(event) => setLink(event.target.value)}
                  />
                  <TextField
                     disabled = {type === "edit" ? !editing : false}
                     margin="normal"
                     id="description"
                     label="Description"
                     fullWidth
                     variant="standard"
                     multiline
                     maxRows={8}
                     value={description}
                     onChange={(event) => setDescription(event.target.value)}
                  />
                  <FormControl fullWidth sx={{ "margin-top": 20 }}>
                     <InputLabel id="demo-simple-select-label">Category</InputLabel>
                     <Select 
                        disabled = {type === "edit" ? !editing : false}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={category}
                        label="Category"
                        onChange={(event) => setCategory(event.target.value)}
                     >
                        {categories.map((category) => (<MenuItem value={category.id}>{category.name}</MenuItem>))}
                     </Select>
                  </FormControl>
               </DialogContent>
               {actionButtons}
               {qrCodeGenerator}
            </Dialog>
         </DialogActions>
      </div>
   );
}