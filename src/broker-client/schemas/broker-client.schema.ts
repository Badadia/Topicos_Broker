import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { QoSLevel } from '../dtos/qosEnum.dto';
import { QoSLevelName } from '../dtos/qosName.dto';

export const BrokerClientSchema = new mongoose.Schema({
  cleansession: {
    type: Boolean,
  },
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  broker_port: {
    type: Number,
  },
  broker_host: {
    type: String,
  },
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  version: {
    type: Number,
  },
  lastwilltopic: {
    type: String,
  },
  lastwillqos: {
    type: {
      type: Number,
      enum: QoSLevel,
      names: QoSLevelName,
    },
  },
  lastwillmessage: {
    type: String,
  },
  lastwillretain: {
    type: Boolean,
  },
  keepalive: {
    type: Number,
  },
});

BrokerClientSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }

    this['password'] = await bcrypt.hash(this['password'], 10);
  } catch (err) {
    return next(err);
  }
});
