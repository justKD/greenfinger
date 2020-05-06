// import { Enum } from "./airtable-enum";
import * as airtable from "./airtable";
import { GlobalManager } from "./GlobalManager";

export const data = {
  manager: new GlobalManager(),
  ids: {},
  records: [],
  pullRecords: callback => {
    return airtable.pullRecords().then(records => {
      if (Array.isArray(records)) {
        data.records = records;
        if (typeof callback === "function") callback();
      }
    });
  },
  addEmptyRecord: callback => {
    return airtable.addEmptyRecord().then(records => {
      if (Array.isArray(records)) {
        records.forEach(record => data.records.push(record));
        if (typeof callback === "function") callback();
      }
    });
  },
  updateRecord: (id, fields, callback) => {
    for (let record of data.records) {
      if (record.id === id) {
        Object.keys(fields).forEach(key => (record.fields[key] = fields[key]));
        break;
      }
    }

    airtable.updateRecord(id, fields, callback);
  },
  deleteRecord: (id, callback) => {
    for (let i in data.records) {
      const record = data.records[i];
      if (record.id === id) {
        data.records.splice(i, 1);
        break;
      }
    }

    airtable.deleteRecord(id, callback);
  },
};
