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
import { ImageUploadModal } from "./ImageUploadModal";

import { Enum } from "../data/airtable-enum";
import { mediaGalleries } from "../styles";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    flexWrap: "nowrap",
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

export const ExampleImages = ({ record }: { record: any }) => {
  const classes = useStyles();
  let thumbnails = [];
  const images = record ? record.get(Enum.fields.exampleMedia) : [];

  const [openImageModal, setOpenImageModal] = React.useState(false);
  const [openImageUploadModal, setOpenImageUploadModal] = React.useState(false);
  const [currentImage, setCurrentImage] = React.useState(null);

  const showImageUploadModal = () => {
    setOpenImageUploadModal(true);
  };

  const hideImageUploadModal = () => {
    setOpenImageUploadModal(false);
  };

  const showImageModal = (index: number) => {
    setCurrentImage(images[index]);
    setOpenImageModal(true);
  };

  const hideImageModal = () => {
    setOpenImageModal(false);
  };

  if (images) {
    thumbnails = images.map((x: any) => {
      return x.thumbnails && x.thumbnails.large
        ? x.thumbnails.large.url
        : x.url;
    });
  }

  return (
    <div>
      {thumbnails.length ? (
        <div className={classes.root}>
          <GridList
            cellHeight={mediaGalleries.cardHeight}
            className={classes.gridList}
            cols={2.5}
          >
            <GridListTile
              className={classes.tile}
              key={"add-item"}
              onClick={showImageUploadModal}
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
            <GridListTile cols={0.25} />
          </GridList>
          <ImageModal
            open={openImageModal}
            onclose={hideImageModal}
            image={currentImage}
          />
        </div>
      ) : (
        <div
          className={classes.addButtonContainer}
          onClick={showImageUploadModal}
        >
          <AddBoxIcon
            className={classes.addButton}
            style={{ fontSize: mediaGalleries.iconSize }}
          />
        </div>
      )}
      <ImageUploadModal
        open={openImageUploadModal}
        onclose={hideImageUploadModal}
        record={record}
        type={Enum.fields.exampleMedia}
      />
    </div>
  );
};
