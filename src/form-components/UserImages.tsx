import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import AddBoxIcon from "@material-ui/icons/AddBox";
// import IconButton from '@material-ui/core/IconButton';
// import StarBorderIcon from '@material-ui/icons/StarBorder';
// import tileData from './tileData';

import { ImageModal } from "./ImageModal";

import { Enum } from "../data/airtable-enum";
import { mediaGalleries } from "../styles";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: "100%",
    height: "100%",
    transform: "translateZ(0)",
  },
  tile: {
    transition: mediaGalleries.transition,
    "&:hover": {
      transform: mediaGalleries.transform,
      boxShadow: mediaGalleries.cardShadow,
    },
  },
  addButtonContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
  },
  addButton: {
    transition: mediaGalleries.transition,
    "&:hover": {
      transform: mediaGalleries.transform,
    },
  },
}));

export const UserImages = ({ record }: { record: any }) => {
  const classes = useStyles();
  let thumbnails = [];

  const images = record ? record.get(Enum.fields.userMedia) : [];

  const [openImageModal, setOpenImageModal] = React.useState(false);
  const [currentImage, setCurrentImage] = React.useState(null);

  const showImageModal = (index: number) => {
    setCurrentImage(images[index]);
    setOpenImageModal(true);
  };

  const hideImageModal = () => {
    setOpenImageModal(false);
  };

  const handleAddImage = () => {
    console.log("add image");
  };

  if (record) {
    const images = record.get(Enum.fields.userMedia);
    if (images) {
      thumbnails = images.map((x: any) => x.thumbnails.large.url);
    }
  }

  return thumbnails.length ? (
    <div className={classes.root}>
      <GridList
        cellHeight={mediaGalleries.cardHeight}
        className={classes.gridList}
        cols={3}
      >
        <GridListTile
          className={classes.tile}
          key={"add-item"}
          onClick={handleAddImage}
        >
          <div className={classes.addButtonContainer}>
            <AddBoxIcon style={{ fontSize: mediaGalleries.iconSize }} />
          </div>
        </GridListTile>
        {thumbnails.map((x: any, index: number) => (
          <GridListTile
            className={classes.tile}
            key={x}
            onClick={() => showImageModal(index)}
          >
            <img src={x} alt={x} />
          </GridListTile>
        ))}
      </GridList>
      <ImageModal
        open={openImageModal}
        onclose={hideImageModal}
        image={currentImage}
      />
    </div>
  ) : (
    <div className={classes.addButtonContainer} onClick={handleAddImage}>
      <AddBoxIcon
        className={classes.addButton}
        style={{ fontSize: mediaGalleries.iconSize }}
      />
    </div>
  );
};
