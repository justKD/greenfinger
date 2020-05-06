import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import ListItemText from "@material-ui/core/ListItemText";
import AddBoxIcon from "@material-ui/icons/AddBox";
import DeleteIcon from "@material-ui/icons/Delete";
import OpenInBrowserIcon from "@material-ui/icons/OpenInBrowser";

import { data } from "../data/";
import { Enum } from "../data/airtable-enum";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
}));

export const LinkList = ({
  links,
  recordId,
}: {
  links: string | undefined;
  recordId: string;
}) => {
  const delim = `$:$:$`;
  const classes = useStyles();
  const addLinkTextFieldId = "edit-form-link-list-add-link";

  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [linkList, setLinkList] = React.useState(
    links ? links.split(delim) : [],
  );
  const [addLinkValue, setAddLinkValue] = React.useState("");

  const handleListItemClick = (index: number) => {
    setSelectedIndex(index);
  };

  const updateAirtableLinkField = () => {
    const fields: any = {};
    fields[Enum.fields.links] = linkList.join(delim);
    data.updateRecord(recordId, fields, () => {
      console.log("done updating");
    });
  };

  const addToLinkList = () => {
    const l = linkList;
    l.push(addLinkValue);
    setLinkList(l);
    setSelectedIndex(0);
    setSelectedIndex(linkList.length - 1);
    setAddLinkValue("");
    updateAirtableLinkField();
  };

  const deleteLink = () => {
    const l = linkList;
    l.splice(selectedIndex, 1);
    setLinkList(l);
    setSelectedIndex(NaN);
    updateAirtableLinkField();
  };

  React.useEffect(() => {
    setLinkList(links ? links.split(delim) : []);
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [links]);

  return (
    <div className={classes.root}>
      <TextField
        error
        id={addLinkTextFieldId}
        label="Error"
        onChange={e => setAddLinkValue(e.target.value)}
        value={addLinkValue}
        helperText="Invalid URL"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                edge="end"
                aria-label="addLink"
                onClick={(e: any) => {
                  addLinkValue ? addToLinkList() : console.log("disabled");
                }}
              >
                {addLinkValue ? (
                  <AddBoxIcon />
                ) : (
                  <AddBoxIcon color="disabled" />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <List component="nav" aria-label="secondary mailbox folder">
        {linkList.map((item: any, index: number) => (
          <ListItem
            key={index}
            button
            selected={selectedIndex === index}
            onClick={() => handleListItemClick(index)}
            style={{ width: "100%" }}
          >
            <ListItemText primary={item} />
            {selectedIndex === index ? (
              <React.Fragment>
                <IconButton
                  edge="end"
                  aria-label="open link"
                  onClick={() => {
                    window.open(linkList[selectedIndex], "_blank");
                  }}
                >
                  <OpenInBrowserIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete link"
                  onClick={(e: any) => {
                    e.stopPropagation();
                    deleteLink();
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </React.Fragment>
            ) : null}
          </ListItem>
        ))}
      </List>
    </div>
  );
};
