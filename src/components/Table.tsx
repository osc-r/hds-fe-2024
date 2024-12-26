import {
  Paper,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableCellProps,
  TableContainer,
  TableHead,
  TableRow,
  SxProps,
  Theme,
  Checkbox,
  TablePagination,
  Pagination,
  CircularProgress,
  Typography,
  Grid2 as Grid,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

export type TableColumnProps<T> = {
  headerName: string;
  field: string;
  headerCellProps?: TableCellProps;
  cellProps?: TableCellProps;
  render?: React.FC<T>;
  sort?: any;
};

export type TableProps<T> = {
  columns: TableColumnProps<T>[];
  data: any[];
  rowSxProps?: (row: T) => SxProps<Theme>;
  loading?: boolean;
  checkedIndex?: number[];
  onCheckChange?: (data: number[]) => void;
  onSizeChange?: (size: number) => void;
  pagination?: {
    currentPage: number;
    total: number;
    onPageChange: (page: number) => void;
  };
  actionComponent?: JSX.Element | null;
  showNumber?: boolean;
  showTotalRecord?: boolean;
  numberSxProps?: { cell: SxProps<Theme>; header: SxProps<Theme> };
  checkboxSxProps?: SxProps<Theme>;
  containerSxProps?: SxProps<Theme>;
};

const defaultCellSx = {
  borderStyle: "solid",
  borderColor: "#cdc5c5",
  borderWidth: 1,

  paddingTop: 0,
  paddingBottom: 0,
};

const HeaderCell = <T,>({ header }: { header: TableColumnProps<T> }) => {
  const [sortDirection, setSortDirection] = useState<null | "DESC" | "ASC">(
    null
  );

  return (
    <TableCell
      key={header.headerName}
      {...header.headerCellProps}
      sx={{
        ...defaultCellSx,
        height: 48,
        fontSize: 15,
        fontWeight: "500",
        whiteSpace: "pre",
        padding: "8px",
        cursor: header.sort ? "pointer" : "default",
        "& span:first-of-type:hover > .MuiSvgIcon-root": {
          opacity: 1,
        },
        userSelect: "none",
        ...header.headerCellProps?.sx,
      }}
      onClick={() => {
        setSortDirection((o) => {
          if (o === null) {
            header.sort && header.sort(header.field, "desc");
            return "DESC";
          } else if (o === "DESC") {
            header.sort && header.sort(header.field, "asc");
            return "ASC";
          } else {
            header.sort && header.sort(header.field, null);
            return null;
          }
        });
      }}
    >
      <span
        style={{
          position: "relative",
          padding: header.sort ? "0 24px 0 0" : 0,
        }}
      >
        <Typography typography={"subtitle2"} sx={{ fontWeight: "bold" }}>
          {header.headerName}
        </Typography>
        {header.sort && (
          <React.Fragment>
            <ArrowDropUpIcon
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                color: sortDirection === "ASC" ? "black" : "grey",
                fontSize: 18,
                opacity: sortDirection === "ASC" ? 1 : 0.3,
              }}
            />
            <ArrowDropDownIcon
              sx={{
                position: "absolute",
                top: 6,
                right: 0,
                color: sortDirection === "DESC" ? "black" : "grey",
                fontSize: 18,
                opacity: sortDirection === "DESC" ? 1 : 0.3,
              }}
            />
          </React.Fragment>
        )}
      </span>
    </TableCell>
  );
};

const Table = <T,>(props: TableProps<T>) => {
  const [selectedAll, setSelectedAll] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);

  const [size, setSize] = useState(10);

  const onChangeSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setSelectedAll(isChecked);
    if (isChecked) {
      const updated = props.data.map((_, i) => i);
      setSelected(updated);
      props.onCheckChange && props.onCheckChange(updated);
    } else {
      setSelected([]);
      props.onCheckChange && props.onCheckChange([]);
    }
  };

  const onChangeSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    i: number
  ) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setSelected((o) => {
        if (o.length + 1 === props.data.length) {
          setSelectedAll(true);
        }
        const updated = [...o, i];
        props.onCheckChange && props.onCheckChange(updated);
        return updated;
      });
    } else {
      setSelectedAll(false);
      setSelected((o) => {
        const updated = o.filter((j) => j !== i);
        props.onCheckChange && props.onCheckChange(updated);
        return updated;
      });
    }
  };

  useEffect(() => {
    setSelectedAll(false);
    setSelected([]);
  }, [props.data]);

  useEffect(() => {
    if (props.checkedIndex && props.checkedIndex.length === 0) {
      setSelectedAll(false);
      setSelected([]);
    }
  }, [props.checkedIndex]);

  const renderHeaderRow = <T,>(data: TableColumnProps<T>[]) => {
    return (
      <TableRow sx={{ backgroundColor: "#e1e1e1", minHeight: 44 }}>
        {props.onCheckChange && (
          <TableCell
            padding="checkbox"
            sx={{ ...defaultCellSx, height: 48, ...props.checkboxSxProps }}
          >
            <Checkbox color="primary" disabled sx={{ opacity: 0 }} />
          </TableCell>
        )}
        {props.showNumber && (
          <TableCell
            sx={{
              ...defaultCellSx,
              height: 48,
              width: 48,
              boxSizing: "border-box",
              ...props.numberSxProps?.header,
            }}
            align="center"
          >
            No
          </TableCell>
        )}
        {data.map((c, i) => {
          return <HeaderCell key={i} header={c} />;
        })}
      </TableRow>
    );
  };

  const PaginationComponent = () => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {props.onSizeChange && (
          <TablePagination
            rowsPerPageOptions={[10, 20, 30, 50, 100]}
            rowsPerPage={size}
            count={100}
            onRowsPerPageChange={(e) => {
              const val = e.target.value as unknown as number;
              setSize(val);
              props.onSizeChange && props.onSizeChange(val);
            }}
            component="div"
            page={0}
            onPageChange={() => {}}
            ActionsComponent={() => null}
            labelDisplayedRows={() => null}
            sx={{
              "& > div:first-of-type": { padding: 0 },
              "& > div:first-of-type > div:first-of-type": { display: "none" },
            }}
          />
        )}
        {props.pagination && (
          <Pagination
            count={Math.ceil(props.pagination.total / size)}
            variant="outlined"
            color="primary"
            shape="rounded"
            sx={{ mt: 2 }}
            page={props.pagination.currentPage}
            onChange={(_, p) => props.pagination?.onPageChange(p)}
            disabled={props.loading}
          />
        )}
      </div>
    );
  };

  const LoadingComponent = () => {
    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FFFFFFD0",
          zIndex: 1,
        }}
      >
        <CircularProgress />
      </div>
    );
  };
  return (
    <React.Fragment>
      <Grid container spacing={2} sx={{ mb: 1 }}>
        {props.onCheckChange && (
          <Grid size={{ xs: 12, md: 0.5 }}>
            <Checkbox
              color="primary"
              checked={selectedAll}
              onChange={onChangeSelectAll}
            />
          </Grid>
        )}
        <Grid size={{ xs: 12, md: props.onCheckChange ? 7.5 : 8 }}>
          {props.actionComponent}
        </Grid>
        {props.showTotalRecord && props.data.length > 0 && (
          <Grid size={{ xs: 12, md: 4 }} textAlign={"right"}>
            <Typography variant="subtitle2" color={"#666666"} sx={{ mb: 1 }}>
              รายการที่{" "}
              {props.pagination
                ? (props.pagination.currentPage - 1) * size + 1
                : 1}{" "}
              -{" "}
              {props.pagination
                ? (props.pagination.currentPage - 1) * size + props.data.length
                : props.data.length}{" "}
              จากทั้งหมด{" "}
              {props.pagination ? props.pagination.total : props.data.length}{" "}
              รายการ
            </Typography>
          </Grid>
        )}
      </Grid>
      <div style={{ position: "relative" }}>
        {props.data.length > 0 && props.loading && <LoadingComponent />}
        <TableContainer component={Paper} sx={{ ...props.containerSxProps }}>
          <MuiTable
            sx={{
              minWidth: 650,
            }}
            aria-label="simple table"
          >
            <TableHead>{renderHeaderRow(props.columns)}</TableHead>
            <TableBody
              sx={{
                position: "relative",
                "& .MuiTableRow-root:hover": {
                  backgroundColor: "#e1e2e76f",
                  cursor: "pointer",
                },
              }}
            >
              {props.data.length === 0 && (
                <TableRow>
                  <TableCell sx={{ height: 250 }}>
                    {props.loading ? (
                      <LoadingComponent />
                    ) : (
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "#FFFFFFD0",
                          zIndex: 1,
                        }}
                      >
                        ไม่พบข้อมูล
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )}
              {props.data.map((row, i) => {
                let index = i + 1;
                if (props.pagination) {
                  index = (props.pagination.currentPage - 1) * size + index;
                }
                return (
                  <TableRow
                    key={i}
                    sx={{
                      height: 48,
                      "&:last-child td, &:last-child th": { borderBottom: 0 },
                      ...(props.rowSxProps && props.rowSxProps(row)),
                    }}
                  >
                    {props.onCheckChange && (
                      <TableCell
                        padding="checkbox"
                        component="td"
                        sx={{ ...defaultCellSx, ...props.checkboxSxProps }}
                      >
                        <Checkbox
                          color="primary"
                          checked={selected.findIndex((j) => j === i) >= 0}
                          onChange={(e) => onChangeSelect(e, i)}
                        />
                      </TableCell>
                    )}
                    {props.showNumber && (
                      <TableCell
                        sx={{ ...defaultCellSx, ...props.numberSxProps?.cell }}
                        align="center"
                      >
                        {index}
                      </TableCell>
                    )}
                    {props.columns.map((c, si) => {
                      const fields = c.field.split(".");
                      let data = row;
                      for (let i = 0; i < fields.length; i++) {
                        data = data[fields[i]];
                        if (data === undefined) {
                          data = "-";
                          break;
                        }
                      }
                      return (
                        <TableCell
                          key={`${i}-${si}`}
                          component="td"
                          scope="row"
                          {...c.cellProps}
                          sx={{
                            ...defaultCellSx,
                            ...c.cellProps?.sx,
                          }}
                        >
                          {c?.render ? (
                            <c.render {...row} index={i} fieldName={c.field} />
                          ) : (
                            data
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </MuiTable>
        </TableContainer>
      </div>
      <PaginationComponent />
    </React.Fragment>
  );
};

Table.defaultProps = { showNumber: true, showTotalRecord: true };

export default Table;
