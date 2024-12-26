import { Box, Button, Grid2 as Grid, Modal, Typography } from "@mui/material";
import React from "react";

type ConfirmModalProps = {
  open: boolean;
  onConfirm: () => void;
  onClose?: () => void;
};

const ConfirmModal = (props: ConfirmModalProps) => {
  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Confirm delete
            </Typography>
          </Grid>
          <Grid size={12}>
            <Typography id="modal-modal-description" sx={{ mt: 1, mb: 2 }}>
              Are you sure to delete this item?
            </Typography>
          </Grid>
          <Grid size={12} sx={{ textAlign: "end" }}>
            <Button variant="text" sx={{ mr: 1 }} onClick={props.onClose}>
              Cancel
            </Button>
            <Button variant="outlined" color="error" onClick={props.onConfirm}>
              Delete
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default ConfirmModal;
