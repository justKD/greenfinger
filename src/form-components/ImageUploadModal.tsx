import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import IconButton from "@material-ui/core/IconButton";
import CancelIcon from "@material-ui/icons/Cancel";

import { data } from "../data";

const useStyles = makeStyles(theme => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(4, 4, 4),
  },
  container: {
    backgroundColor: theme.palette.background.paper,
    outline: "none",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(1, 4, 2),
  },
  topContainer: {
    textAlign: "center",
    padding: theme.spacing(1, 4, 1),
  },
  bottomContainer: {
    width: "100%",
    height: "100%",
    maxHeight: "500px",
    transform: "translateZ(0)",
  },
  imagePreview: {
    height: "200px",
    width: "100%",
    objectFit: "cover",
  },
  titleBarBottom: {
    background:
      "linear-gradient(to top, rgba(0,0,0,0.7) 0%, " +
      "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
  },
  titleBarTop: {
    background:
      "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, " +
      "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
  },
  icon: {
    color: "white",
  },
}));

export const ImageUploadModal = ({
  open,
  onclose,
  record,
  type,
}: {
  open: boolean;
  onclose: () => void;
  record: any;
  type: string;
}) => {
  const classes = useStyles();

  const [uploading, setUploading] = React.useState(false);
  const [readyToUpload, setReadyToUpload] = React.useState(false);
  const [currentFiles, setCurrentFiles] = React.useState([] as any[]);
  const [currentImages, setCurrentImages] = React.useState([] as any[]);

  const handleCurrentFilesChanged = React.useCallback(() => {
    const promiseImages = async () => {
      const promise = new Promise(resolve => {
        const imgs: any[] = [];
        if (currentFiles.length) {
          currentFiles.forEach((file, index) => {
            imgs.push({
              image: URL.createObjectURL(file),
              name: file.name,
              fileIndex: index,
            });
            if (imgs.length === currentFiles.length) resolve(imgs);
            // const reader = new FileReader();
            // reader.onload = (e: any) => {
            //   imgs.push({
            //     image: e.target.result,
            //     name: currentFiles[index].name,
            //     fileIndex: index,
            //   });
            //   if (imgs.length === currentFiles.length) resolve(imgs);
            // };
            // reader.readAsDataURL(file);
          });
        } else {
          resolve(imgs);
        }
      });
      return await promise;
    };

    promiseImages().then((imgs: any) => {
      imgs = imgs.sort((a: any, b: any) => a.fileIndex - b.fileIndex);
      setCurrentImages(imgs);
      setReadyToUpload(imgs.length);
    });
  }, [currentFiles]);

  React.useEffect(() => {
    handleCurrentFilesChanged();
  }, [handleCurrentFilesChanged]);

  const handleAddMedia = React.useCallback(() => {
    const n = document.createElement("input");
    n.id = "addExampleMediaInputNode";
    n.type = "file";
    n.accept = "image/*";
    n.multiple = true;
    n.style.display = "none";
    n.onchange = (e: any) => {
      const files = n.files ? Array.from(e.target.files) : [];
      setCurrentFiles(files);
      document.body.removeChild(n);
    };

    document.body.appendChild(n);
    n.click();
  }, []);

  const handleUpload = React.useCallback(() => {
    console.log("upload", currentImages);

    const fields: any = {};
    fields[type] = currentImages.map((image: any) => {
      console.log(image.image);
      return {
        url: image.image,
        filename: image.name,
      };
    });

    console.log(fields);
    data.updateRecord(record.id, fields, (records: any) => {
      console.log("done updating", records);
    });
  }, [currentImages, record, type]);

  const renderImagePreview = (image: any, index: number) => {
    const handleRemoveImage = () => {
      const files = currentFiles;
      files.splice(image.fileIndex, 1);
      setCurrentFiles(files);
      handleCurrentFilesChanged();
    };

    return (
      <GridListTile key={index} cols={0.5} rows={1}>
        <img
          id={`imagePreviewCell`}
          src={image.image}
          alt={image.name}
          className={classes.imagePreview}
        />
        <GridListTileBar
          titlePosition="top"
          actionIcon={
            <IconButton
              aria-label={`close ${image.name}`}
              className={classes.icon}
              onClick={handleRemoveImage}
            >
              <CancelIcon />
            </IconButton>
          }
          actionPosition="right"
          className={classes.titleBarTop}
        />
        <GridListTileBar
          title={image.name}
          titlePosition="bottom"
          className={classes.titleBarBottom}
        />
      </GridListTile>
    );
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={open}
      onClose={onclose}
      closeAfterTransition
      disableEnforceFocus
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Container maxWidth="md" className={classes.container}>
          <Grid container spacing={3} className={classes.topContainer}>
            <Grid item xs={12}>
              <Typography variant="h5">Upload Example Media</Typography>
            </Grid>

            <React.Fragment>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  color="primary"
                  disableElevation
                  onClick={handleAddMedia}
                >
                  {!readyToUpload ? "Select Media" : "Start Over"}
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!readyToUpload}
                  disableElevation
                  onClick={handleUpload}
                >
                  Confirm Upload
                </Button>
              </Grid>
            </React.Fragment>
            <Grid item xs={12}>
              <Divider variant="middle" />
            </Grid>
          </Grid>
          <GridList
            cellHeight={200}
            spacing={1}
            className={classes.bottomContainer}
          >
            {(() => {
              switch (true) {
                case uploading:
                  return <div>uploading</div>;
                case currentImages.length > 0:
                  return currentImages.map((image: any, index: number) =>
                    renderImagePreview(image, index),
                  );
                default:
                  return <div style={{ height: "128px" }} />;
              }
            })()}
          </GridList>
          {/* <Grid container spacing={3} className={classes.bottomContainer}>
            {(() => {
              switch (true) {
                case uploading:
                  return <div>uploading</div>;
                case currentImages.length > 0:
                  return currentImages.map((image: string, index: number) =>
                    renderImagePreview(image, index),
                  );
                default:
                  return <div style={{ height: "128px" }} />;
              }
            })()}
          </Grid> */}
        </Container>
      </Fade>
    </Modal>
  );
};
