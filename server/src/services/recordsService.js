import { RecordModel } from "../models/Record.js";

export const RecordService = {
  getAllRecords: async (sortBy, order, search) => {
    const records = await RecordModel.queryAllRecord(sortBy, order, search);
    return records;
  },

  getRecordById: async (id) => {
    const record = await RecordModel.queryRecordById(id);
    return record;
  },

  createRecord: async (data) => {
    const record = await RecordModel.createRecord(data);
    return record;
  },

  updateRecord: async (data) => {
    const record = await RecordModel.updateRecord(data);
    return record;
  },

  deleteRecord: async (id) => {
    const count = await RecordModel.deleteRecord(id);
    return count;
  },
};
