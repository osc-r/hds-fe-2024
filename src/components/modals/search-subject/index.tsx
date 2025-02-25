import Table, { TableColumnProps } from "@/components/Table";
import { Box, Button, Grid2 as Grid, Modal, Typography } from "@mui/material";
import React from "react";
import { SubmitHandler } from "react-hook-form";
import SearchSubjectForm, {
  SearchSubjectFormType,
} from "@/components/forms/enrollment-individual/SearchSubjectForm";
import { SubjectOffered } from "../../../services/subject/subject";

type SearchSubjectModalProps = {
  open: boolean;
  subjects: SubjectOffered[];
  onSearch: SubmitHandler<SearchSubjectFormType>;
  onSelectSubject: (subject: SubjectOffered) => void;
  onClose?: () => void;
};

const columns = (
  onSelect: (subject: SubjectOffered) => void
): TableColumnProps<SubjectOffered>[] => [
  {
    field: "subject.code.th",
    headerName: "รหัสวิชา",
    headerCellProps: { align: "center" },
    cellProps: { align: "center" },
  },
  {
    field: "subject.name.th",
    headerName: "ชื่อวิชา",
    headerCellProps: { align: "center" },
    cellProps: { align: "center" },
  },
  {
    field: "subject.credit",
    headerName: "หน่วยกิต",
    headerCellProps: { align: "center" },
    cellProps: { align: "center" },
  },
  {
    field: "offered",
    headerName: "วันที่เรียน",
    headerCellProps: { align: "center" },
    cellProps: { align: "center" },
  },
  {
    field: "offered",
    headerName: "ชั้นเรียน",
    headerCellProps: { align: "center" },
    cellProps: { align: "center" },
    render: (row) => {
      return row.degreeLevel + " " + row.grade + "/" + row.room;
    },
  },
  {
    field: "offered",
    headerName: "ครูผู้สอน",
    headerCellProps: { align: "center" },
    cellProps: { align: "center" },
  },
  {
    field: "",
    headerName: "",
    headerCellProps: { align: "center" },
    cellProps: { align: "center" },
    render: (row) => {
      return <Button onClick={() => onSelect(row)}>เลือก</Button>;
    },
  },
];

const SearchSubjectModal = (props: SearchSubjectModalProps) => {
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
          height: 650,
          overflow: "auto",
        }}
      >
        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              เลือกรายวิชาที่ลงทะเบียน
            </Typography>
          </Grid>
          <Grid size={12} container spacing={2}>
            <SearchSubjectForm onSubmit={props.onSearch} />
          </Grid>
          <Grid size={12}>
            <Table
              columns={columns(props.onSelectSubject)}
              data={props.subjects}
              onSizeChange={() => {}}
              pagination={{
                total: 10,
                onPageChange: () => {},
                currentPage: 1,
              }}
              showNumber
            />
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default SearchSubjectModal;
