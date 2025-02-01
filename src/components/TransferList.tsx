import * as React from "react";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

function not(
  a: { label: string; value: string }[],
  b: { label: string; value: string }[]
) {
  return a.filter((i) => b.findIndex((j) => j.value === i.value) === -1);
}

function intersection(
  a: { label: string; value: string }[],
  b: { label: string; value: string }[]
) {
  return a.filter((i) => b.findIndex((j) => j.value === i.value) !== -1);
}

function union(
  a: { label: string; value: string }[],
  b: { label: string; value: string }[]
) {
  return [...a, ...not(b, a)];
}

export default function TransferList(props: {
  options: { label: string; value: string }[];
  selectedList: { label: string; value: string }[];
  setSelectedList: React.Dispatch<
    React.SetStateAction<{ label: string; value: string }[]>
  >;
}) {
  const [checked, setChecked] = React.useState<
    { label: string; value: string }[]
  >([]);

  const [options, setOptions] = React.useState<
    { label: string; value: string }[]
  >(props.options);
  const [selectedList, setSelectedList] = React.useState<
    { label: string; value: string }[]
  >(props.selectedList);

  React.useEffect(() => {
    setOptions(props.options);
  }, [props.options]);

  const leftChecked = intersection(checked, options);
  const rightChecked = intersection(checked, selectedList);

  const handleToggle = (value: { label: string; value: string }) => () => {
    const currentIndex = checked.findIndex((i) => i.value === value.value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  const numberOfChecked = (items: { label: string; value: string }[]) =>
    intersection(checked, items).length;

  const handleToggleAll = (items: { label: string; value: string }[]) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleSelectRight = () => {
    setSelectedList(selectedList.concat(leftChecked));
    props.setSelectedList(selectedList.concat(leftChecked));
    setOptions(not(options, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleSelectLeft = () => {
    setOptions(options.concat(rightChecked));
    setSelectedList(not(selectedList, rightChecked));
    props.setSelectedList(not(selectedList, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const customList = (
    title: React.ReactNode,
    items: { label: string; value: string; data?: any }[],
    btn: React.ReactNode
  ) => (
    <Card>
      <CardHeader
        sx={{
          px: 2,
          py: 1,
          ".MuiCardHeader-action": {
            margin: "auto 0",
          },
        }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={
              numberOfChecked(items) === items.length && items.length !== 0
            }
            indeterminate={
              numberOfChecked(items) !== items.length &&
              numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{
              "aria-label": "all items selected",
            }}
          />
        }
        action={btn}
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
        end
      />
      <Divider />
      <List
        sx={{
          minHeight: 360,
          maxHeight: 600,
          bgcolor: "background.paper",
          overflow: "auto",
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((value) => {
          const labelId = `transfer-list-all-item-${value}-label`;

          const year = new Date(value.data.attendedDate).toLocaleDateString(
            "th-TH",
            {
              year: "numeric",
            }
          );

          return (
            <ListItem
              key={value.value}
              role="listitem"
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={
                    checked.findIndex((i) => i.value === value.value) !== -1
                  }
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    "aria-labelledby": labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText
                id={labelId}
                primary={value.label}
                secondary={`เข้ารับการศึกษาเมื่อ ${year}`}
              />
            </ListItem>
          );
        })}
      </List>
    </Card>
  );

  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={5.75}>
        {customList(
          "รายชื่อนักเรียน",
          options,
          <Button
            variant="outlined"
            size="small"
            onClick={handleSelectRight}
            disabled={leftChecked.length === 0}
          >
            เลือก
          </Button>
        )}
      </Grid>
      <Grid
        item
        xs={0.5}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      />
      <Grid item xs={5.75}>
        {customList(
          "รายการที่ถูกเลือก",
          selectedList,
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={handleSelectLeft}
            disabled={rightChecked.length === 0}
          >
            นำออก
          </Button>
        )}
      </Grid>
    </Grid>
  );
}
