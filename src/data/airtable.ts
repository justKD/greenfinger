import { Enum } from "./airtable-enum";

const Airtable = require("airtable");
Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: "keyUrF47pJTpGHds9",
});
const base = Airtable.base("appnX1kevtGlCEHRh");

export const pullRecords = async () => {
  const promise = new Promise((resolve, reject) => {
    const arr: any[] = [];
    base(Enum.tables.plants)
      .select({
        view: "Grid view",
      })
      .eachPage(
        (records: any, fetchNextPage: any) => {
          records.forEach((record: any) => arr.push(record));
          fetchNextPage();
        },
        (err: any) => {
          if (err) {
            console.error(err);
            reject(err);
          }
          resolve(arr);
        },
      );
  });

  return await promise;
};

export const addEmptyRecord = async () => {
  const promise = new Promise((resolve, reject) => {
    base(Enum.tables.plants).create([{ fields: {} }], function(
      err: Error,
      records: any[],
    ) {
      if (err) {
        console.error(err);
        reject(err);
      }
      resolve(records);
    });
  });

  return await promise;
};

export const deleteRecord = (id: string, callback: (err: Error) => void) => {
  base(Enum.tables.plants).destroy([id], function(err: Error) {
    if (err) console.error(err);
    if (typeof callback === "function") callback(err);
  });
};

export const updateRecord = (
  id: string,
  fields: any,
  callback: (records: any) => void,
) => {
  base(Enum.tables.plants).update(
    [
      {
        id: id,
        fields: fields,
      },
    ],
    function(err: Error, records: any) {
      if (err) {
        console.error(err);
        return;
      }
      if (typeof callback === "function") callback(records);
    },
  );
};
