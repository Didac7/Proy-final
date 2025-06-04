import Header from "../../components/common/Header"; 
import UsersTable from "../../components/users/UsersTable";
import AddUserForm from "../../components/users/AddUserForm";
import { useState } from "react";
import Modal from "@mui/material/Modal";
import { Box, Button } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#1f2937", // bg-gray-800
  border: "2px solid #374151", // border-gray-700
  boxShadow: 24,
  p: 0,
  borderRadius: 3,
};

const UsersPage = ({ userPermissions }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Usuarios" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <div className="flex justify-end mb-4">
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Registrar Usuario
          </Button>
        </div>
        <UsersTable userPermissions={userPermissions}/>
        <Modal open={open} onClose={handleClose}>
          <Box sx={style}>
            <AddUserForm onUserCreated={handleClose} />
          </Box>
        </Modal>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8"></div>
      </main>
    </div>
  );
};
export default UsersPage;
