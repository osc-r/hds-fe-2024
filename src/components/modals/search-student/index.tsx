import SearchStudentForm, {
  SearchStudentFormType,
} from "@/components/forms/enrollment-individual/SearchStudentForm";
import Table, { TableColumnProps } from "@/components/Table";
import { Box, Button, Grid2 as Grid, Modal, Typography } from "@mui/material";
import React from "react";
import { Menu } from "@/components/forms/form";
import { SubmitHandler } from "react-hook-form";
import { Student } from "../../../services/calendar/calendar";

type SearchStudentModalProps = {
  open: boolean;
  onSearch: SubmitHandler<SearchStudentFormType>;
  onSelectStudent: (studentId: string, studentName: string) => void;
  classOptions: Menu;
  academicTermId: string;
  academicTermLabel: string;
  onClose?: () => void;
  students: Student[];
};

const columns = (
  onSelect: (studentId: string, studentName: string) => void
): TableColumnProps<Student>[] => [
  {
    field: "code",
    headerName: "เลขประจำตัวนักเรียน",
    headerCellProps: { align: "center" },
    cellProps: { align: "center" },
  },
  {
    field: "firstName.th",
    headerName: "ชื่อ-นามสกุล",
    headerCellProps: { align: "center" },
    cellProps: { align: "center" },
  },
  {
    field: "offered",
    headerName: "ชั้นเรียน",
    headerCellProps: { align: "center" },
    cellProps: { align: "center" },
  },
  {
    field: "status",
    headerName: "สถานะนักเรียน",
    headerCellProps: { align: "center" },
    cellProps: { align: "center" },
  },
  {
    field: "",
    headerName: "",
    headerCellProps: { align: "center" },
    cellProps: { align: "center" },
    render: (row) => {
      return (
        <Button
          onClick={() =>
            onSelect(
              row._id,
              row.code + ": " + row.firstName.th + " " + row.lastName.th
            )
          }
        >
          เลือก
        </Button>
      );
    },
  },
];

const SearchStudentModal = (props: SearchStudentModalProps) => {
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
          width: 800,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              เลือกนักเรียนในปีการศึกษา {props.academicTermLabel}
            </Typography>
          </Grid>
          <Grid size={12} container spacing={2}>
            <SearchStudentForm
              onSubmit={props.onSearch}
              classOptions={props.classOptions}
            />
          </Grid>
          <Grid size={12}>
            {/* <Typography id="modal-modal-description" sx={{ mt: 1, mb: 2 }}>
              Are you sure to delete this item?
            </Typography> */}

            <Table
              columns={columns(props.onSelectStudent)}
              data={props.students}
              onSizeChange={() => {}}
              pagination={{
                total: 10,
                onPageChange: () => {},
                currentPage: 1,
              }}
              showNumber
              // loading={isLoading}
            />
          </Grid>
          {/* <Grid size={12} sx={{ textAlign: "end" }}>
            <Button variant="text" sx={{ mr: 1 }} onClick={props.onClose}>
              Cancel
            </Button>
            <Button variant="outlined" color="error" onClick={props.onConfirm}>
              Delete
            </Button>
          </Grid> */}
        </Grid>
      </Box>
    </Modal>
  );
};

export default SearchStudentModal;
