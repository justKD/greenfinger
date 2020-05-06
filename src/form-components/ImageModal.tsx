import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

const useStyles = makeStyles(theme => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(2, 4, 3),
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    outline: "none",
    boxShadow: theme.shadows[5],
    height: "100%",
    width: "100%",
  },
  image: {
    height: "100%",
    width: "100%",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  },
}));

export const ImageModal = ({
  open,
  onclose,
  image,
}: {
  open: boolean;
  onclose: () => void;
  image: any;
}) => {
  const classes = useStyles();

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={open}
      onClick={onclose}
      closeAfterTransition
      disableEnforceFocus
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <div className={classes.paper}>
          <div
            className={classes.image}
            style={{ backgroundImage: image ? `url(${image.url})` : "url()" }}
          />
        </div>
      </Fade>
    </Modal>
  );
};
