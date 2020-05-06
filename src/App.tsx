import * as React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import { fromEvent } from "rxjs";
import { debounceTime } from "rxjs/operators";
import "./styles.css";

import { data } from "./data";
import { cardStyles, plantListStyles } from "./styles";

import { VirtualizedList } from "./VirtualizedList";
import { EditForm } from "./EditForm";

export default function App() {
  const [records, setRecords] = React.useState(data.records);
  const [openDeleteAlert, setOpenDeleteAlert] = React.useState(false);
  const [openDeleteError, setOpenDeleteError] = React.useState(false);

  const [plantListSize, setPlantListSize] = React.useState({
    w: window.innerWidth / 2,
    h: window.innerHeight,
  });
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleSelectListItem = (index: number) => {
    setSelectedIndex(index);
  };

  const updatePlantListSize = () => {
    const h =
      window.innerHeight -
      cardStyles.margin * 3 -
      plantListStyles.itemSize -
      plantListStyles.divider.marginBottom;
    const w = window.innerWidth / 3;
    const minW = cardStyles.minSize.w;
    const minH = cardStyles.minSize.h;
    if (h !== plantListSize.h || w !== plantListSize.w) {
      setPlantListSize({ w: w > minW ? w : minW, h: h > minH ? h : minH });
    }
  };

  const pullRecords = () => {
    data.pullRecords(() => {
      setRecords(data.records);
    });
  };

  const addEmptyRecord = () => {
    data.addEmptyRecord(() => {
      setRecords(data.records);
      setSelectedIndex(records.length - 1);
    });
  };

  const handleDelete = {
    alert: {
      open: () => {
        setOpenDeleteAlert(true);
      },
      close: () => {
        setOpenDeleteAlert(false);
      },
    },
    error: {
      open: () => setOpenDeleteError(true),
      close: () => setOpenDeleteError(false),
    },
    confirm: () => {
      data.deleteRecord(
        (data.records[selectedIndex] as any).id,
        (err: Error) => {
          handleDelete.alert.close();
          err
            ? setOpenDeleteError(true)
            : setSelectedIndex(
                selectedIndex - 1 >= 0 ? selectedIndex - 1 : NaN,
              );
        },
      );
    },
  };

  const listenForResize = () => {
    const handleOnResize = () => {
      updatePlantListSize();
    };

    const resizeEvent = fromEvent(window, "resize");
    //const debounce = resizeEvent.pipe(debounceTime(resizeDebounceTime));
    resizeEvent.subscribe(_ => handleOnResize());
  };

  // component mount
  React.useEffect(() => {
    pullRecords();
    updatePlantListSize();
    listenForResize();
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  return (
    <div className="App">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: cardStyles.margin * 2,
        }}
      >
        <h2>Plant List</h2>
      </div>
      <div style={{ display: "flex" }}>
        <VirtualizedList
          selectedIndex={selectedIndex}
          onclick={handleSelectListItem}
          records={records}
          size={plantListSize}
          addEmptyRecord={addEmptyRecord}
          deleteRecord={handleDelete.alert.open}
        />
        <EditForm
          records={records}
          height={plantListSize.h}
          selectedIndex={selectedIndex}
        />
      </div>
      <Dialog
        open={openDeleteAlert}
        onClose={handleDelete.alert.close}
        aria-labelledby="delete-alert-dialog-title"
        aria-describedby="delete-alert-dialog-description"
      >
        <DialogTitle id="delete-alert-dialog-title">{`Delete record?`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-alert-dialog-description">
            {`Are you sure you want to permanently delete the selected record?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete.alert.close} color="primary">
            No
          </Button>
          <Button onClick={handleDelete.confirm} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openDeleteError}
        onClose={handleDelete.error.close}
        aria-labelledby="delete-error-dialog-title"
        aria-describedby="delete-error-dialog-description"
      >
        <DialogTitle id="delete-error-dialog-title">{`Something went wrong...`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-error-dialog-description">
            {`Sorry, there was an error deleting the record at this time. Please try again.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete.error.close} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
