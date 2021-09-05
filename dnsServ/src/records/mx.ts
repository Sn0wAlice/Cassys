import {
  validateNsName,
  validateUint16BE,
  validateUint32BE,
} from "../validators.ts";
import { DNSRecordType, IRecord } from "./types.ts";

export interface MXRecordOptions {
  exchange: string;
  priority?: number;
  ttl?: number;
}

export class MXRecord implements IRecord {
  type: DNSRecordType = "MX";
  target: void;
  exchange: string;
  priority: number = 0;
  ttl: number = 600;

  constructor(options: MXRecordOptions) {
    if (typeof options.exchange !== "string")
      throw new Error("Expected Exchange value for MX Record");

    if (!validateNsName(options.exchange))
      throw new Error("Invalid Exchange value for MX Record");
    this.exchange = options.exchange;

    if (typeof options.priority === "number") {
      if (!validateUint16BE(options.priority))
        throw new Error("Invalid Priority value, expected Uint16BE");
      this.priority = options.priority;
    }
    if (typeof options.ttl === "number") {
      if (!validateUint32BE(options.ttl))
        throw new Error("Invalid TTL value, expected Uint32BE");
      this.ttl = options.ttl;
    }
  }
}
