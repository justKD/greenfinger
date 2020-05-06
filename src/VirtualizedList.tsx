import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
// import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import Skeleton from "@material-ui/lab/Skeleton";

import { Enum } from "./data/airtable-enum";
import { data } from "./data";
import { cardStyles, plantListStyles } from "./styles";

import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";

const FixedSizeList = require("react-window").FixedSizeList;

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    marginLeft: cardStyles.margin,
    boxShadow: cardStyles.shadow,
  },
  list: {
    overflowY: "scroll",
  },
  addItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all .1s ease-in-out",
    "&:hover": {
      transform: "scale(1.2)",
    },
  },
}));

export const VirtualizedList = ({
  records,
  size,
  onclick,
  selectedIndex,
  addEmptyRecord,
  deleteRecord,
}: {
  records: any[];
  size: { w: number; h: number };
  onclick: (index: number) => void;
  selectedIndex: number;
  addEmptyRecord: () => void;
  deleteRecord: () => void;
}): JSX.Element => {
  const itemSize = plantListStyles.itemSize;

  const classes = useStyles();

  const renderRow = (props: { index: number; style: {} }) => {
    const { index, style } = props;

    const showSkeleton = () => (
      <Skeleton
        variant="text"
        width={size.w}
        height={itemSize / 2}
        animation="wave"
      />
    );

    if (records.length) {
      const record = records[index] as any;
      const name = record.get(Enum.fields.plantName);
      const text = name ? name : "(empty)";

      return (
        <ListItem
          button
          style={style}
          key={index}
          selected={selectedIndex === index}
          onClick={() => onclick(index)}
        >
          <ListItemText primary={`${text}`} />
          {selectedIndex === index ? (
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => {
                deleteRecord();
              }}
            >
              <DeleteIcon />
            </IconButton>
          ) : null}
        </ListItem>
      );
    } else {
      return (
        <ListItem button style={style} key={index}>
          {showSkeleton()}
        </ListItem>
      );
    }
  };

  return (
    <div
      className={classes.root}
      style={{
        width: size.w,
        height: size.h,
      }}
    >
      <ListItem
        className={classes.addItem}
        key={"add-item"}
        onClick={addEmptyRecord}
      >
        <AddIcon />
      </ListItem>
      <Divider
        style={{
          marginBottom: plantListStyles.divider.marginBottom,
        }}
        variant="middle"
      />
      <FixedSizeList
        className={classes.list}
        height={size.h - itemSize - plantListStyles.divider.marginBottom}
        width={size.w}
        itemSize={itemSize}
        itemCount={records.length ? records.length : size.h / itemSize}
      >
        {renderRow}
      </FixedSizeList>
    </div>
  );
};
