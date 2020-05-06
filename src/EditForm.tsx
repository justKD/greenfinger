import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import NativeSelect from "@material-ui/core/NativeSelect";
import Skeleton from "@material-ui/lab/Skeleton";

import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { observe } from "./rxjs-helpers/observe";

import { ExampleImages } from "./form-components/ExampleImages";
import { UserImages } from "./form-components/UserImages";
import { LinkList } from "./form-components/LinkList";

import { data } from "./data/";
import { Enum } from "./data/airtable-enum";
import { cardStyles } from "./styles";

/*

- changes saved notice

- add image
- images changes saved to airtable

- delete images

- allow videos?

- image avatar on list?

- ux animations

- notification cards?
*/

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: cardStyles.shadow,
    width: "100%",
    minWidth: cardStyles.minSize.w * 2 - cardStyles.formPadding * 2,
    marginLeft: cardStyles.margin,
    marginRight: cardStyles.margin,
    padding: cardStyles.formPadding,
    overflowY: "scroll",
    overflowX: "hidden",
    "& .MuiTextField-root": {
      width: "100%",
    },
  },
  formControl: {
    width: "100%",
  },
}));

export const EditForm = ({
  selectedIndex,
  height,
  records,
}: {
  selectedIndex: number;
  height: number;
  records: any[];
}): JSX.Element => {
  const classes = useStyles();

  const record = records[selectedIndex];

  const selectOptions = React.useCallback(() => {
    return {
      months: [
        "",
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      types: ["", "Annual", "Perennial", "Biennial"],
    };
  }, []);

  const [plantName, setPlantName] = React.useState();
  const [scientificName, setScientificName] = React.useState();
  const [type, setType] = React.useState();
  const [startSeason, setStartSeason] = React.useState();
  const [endSeason, setEndSeason] = React.useState();
  const [notes, setNotes] = React.useState();
  const [plantingInstructions, setPlantingInstructions] = React.useState();
  const [careInstructions, setCareInstructions] = React.useState();
  const [links] = React.useState();

  const [observableProxy, setObservableProxy] = React.useState();

  const funcsForSet = React.useCallback(
    () => [
      setPlantName,
      setScientificName,
      setType,
      setStartSeason,
      setEndSeason,
      setNotes,
      setPlantingInstructions,
      setCareInstructions,
    ],
    [],
  );

  const fieldNames = React.useCallback(
    () => [
      Enum.fields.plantName,
      Enum.fields.scientificName,
      Enum.fields.type,
      Enum.fields.season.start,
      Enum.fields.season.end,
      Enum.fields.notes,
      Enum.fields.plantingInstructions,
      Enum.fields.careInstructions,
    ],
    [],
  );

  React.useEffect(() => {
    fieldNames()
      .map((x: string, i: number) => [funcsForSet()[i], x])
      .forEach((x: any) => {
        const [setStateValue, fieldName] = x;
        const getValue = (f: string) => (record.get(f) ? record.get(f) : "");
        const value = record ? getValue(fieldName) : "";
        setStateValue(value);
      });

    const { observables, proxy } = observe({
      updateQueue: {},
    });

    setObservableProxy(proxy);

    observables.updateQueue
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
      )
      .subscribe({
        next: queue => {
          if (record && Object.keys(queue).length > 0) {
            data.updateRecord(record.id, queue, () => {
              console.log("done updating");
            });
          }
        },
      });

    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [record]);

  const set: any = ((obj: {}) => {
    [
      "plantName",
      "scientificName",
      "type",
      "startSeason",
      "endSeason",
      "notes",
      "plantingInstructions",
      "careInstructions",
    ]
      .map((x: string, i: number) => [x, funcsForSet()[i]])
      .forEach((x: any, index: number) => {
        const [key, setProp] = x;
        Object.defineProperty(obj, key, {
          value: (e: any) => {
            setProp(e.target.value);
            const fieldName = fieldNames()[index];
            const q: any = {};
            q[fieldName] = e.target.value;
            observableProxy.updateQueue = q;
          },
          enumerable: true,
        });
      });
    return obj;
  })({});

  const containerSpacing = 6;

  const renderSkeleton = {
    text: () => <Skeleton variant="text" height={70} animation="wave" />,
    rect: () => <Skeleton variant="rect" height={120} animation="wave" />,
  };

  return (
    <form
      className={classes.root}
      style={{ height: height - cardStyles.formPadding * 2 }}
      noValidate
      autoComplete="off"
    >
      <Grid id="row-1" container spacing={containerSpacing}>
        <Grid item xs={6}>
          {record ? (
            <TextField
              id="plant-name"
              label="Plant Name"
              value={plantName}
              onChange={e => set.plantName(e)}
              helperText=" "
            />
          ) : (
            renderSkeleton.text()
          )}
        </Grid>
        <Grid item xs={6}>
          {record ? (
            <TextField
              id="scientific-name"
              label="Scientific Name"
              value={scientificName}
              onChange={e => set.scientificName(e)}
              helperText=" "
            />
          ) : (
            renderSkeleton.text()
          )}
        </Grid>
      </Grid>

      <Grid id="row-2" container spacing={containerSpacing}>
        <Grid item xs={6}>
          {record ? (
            <FormControl className={classes.formControl}>
              <InputLabel shrink htmlFor="type">
                Type
              </InputLabel>
              <NativeSelect
                value={type}
                onChange={e => set.type(e)}
                inputProps={{
                  name: "type",
                  id: "type",
                }}
              >
                {selectOptions().types.map(x => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </NativeSelect>
              <FormHelperText>{`${" "}`}</FormHelperText>
            </FormControl>
          ) : (
            renderSkeleton.text()
          )}
        </Grid>
        <Grid item xs={3}>
          {record ? (
            <FormControl className={classes.formControl}>
              <InputLabel shrink htmlFor="blooming-season-start">
                Season
              </InputLabel>
              <NativeSelect
                value={startSeason}
                onChange={e => set.startSeason(e)}
                inputProps={{
                  name: "blooming-season-start",
                  id: "blooming-season-start",
                }}
              >
                {selectOptions().months.map(x => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </NativeSelect>
              <FormHelperText>Start</FormHelperText>
            </FormControl>
          ) : (
            renderSkeleton.text()
          )}
        </Grid>
        <Grid item xs={3}>
          {record ? (
            <FormControl className={classes.formControl}>
              <InputLabel shrink htmlFor="blooming-season-end" />
              <NativeSelect
                value={endSeason}
                onChange={e => set.endSeason(e)}
                inputProps={{
                  name: "blooming-season-end",
                  id: "blooming-season-end",
                }}
              >
                {selectOptions().months.map(x => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </NativeSelect>
              <FormHelperText>End</FormHelperText>
            </FormControl>
          ) : (
            renderSkeleton.text()
          )}
        </Grid>
      </Grid>

      <Grid id="row-3" container spacing={containerSpacing}>
        <Grid item xs={12}>
          {record ? (
            <React.Fragment>
              <InputLabel shrink style={{ textAlign: "left" }}>
                {"Example Media"}
              </InputLabel>
              <ExampleImages record={record} />
            </React.Fragment>
          ) : (
            renderSkeleton.rect()
          )}
        </Grid>
      </Grid>

      <Grid id="row-4" container spacing={containerSpacing}>
        <Grid item xs={12}>
          {record ? (
            <React.Fragment>
              <TextField
                id="notes"
                label="Notes"
                multiline
                value={notes}
                onChange={e => set.notes(e)}
              />
              <FormHelperText>{`${" "}`}</FormHelperText>
            </React.Fragment>
          ) : (
            renderSkeleton.rect()
          )}
        </Grid>
      </Grid>

      <Grid id="row-5" container spacing={containerSpacing}>
        <Grid item xs={12}>
          {record ? (
            <React.Fragment>
              <TextField
                id="planting-instructions"
                label="Planting Instructions"
                multiline
                value={plantingInstructions}
                onChange={e => set.plantingInstructions(e)}
              />
              <FormHelperText>{`${" "}`}</FormHelperText>
            </React.Fragment>
          ) : (
            renderSkeleton.rect()
          )}
        </Grid>
      </Grid>

      <Grid id="row-6" container spacing={containerSpacing}>
        <Grid item xs={12}>
          {record ? (
            <React.Fragment>
              <TextField
                id="care-instructions"
                label="Care Instructions"
                multiline
                value={careInstructions}
                onChange={e => set.careInstructions(e)}
              />
              <FormHelperText>{`${" "}`}</FormHelperText>
            </React.Fragment>
          ) : (
            renderSkeleton.rect()
          )}
        </Grid>
      </Grid>

      <Grid id="row-7" container spacing={containerSpacing}>
        <Grid item xs={12}>
          {record ? (
            <React.Fragment>
              <InputLabel shrink style={{ textAlign: "left" }}>
                {"Your Media"}
              </InputLabel>
              <UserImages record={record} />
              <FormHelperText>{`${" "}`}</FormHelperText>
            </React.Fragment>
          ) : (
            renderSkeleton.rect()
          )}
        </Grid>
      </Grid>

      <Grid id="row-8" container spacing={containerSpacing}>
        <Grid item xs={12}>
          {record ? (
            <LinkList recordId={record.id} links={links ? links : ""} />
          ) : (
            renderSkeleton.text()
          )}
        </Grid>
      </Grid>
    </form>
  );
};
