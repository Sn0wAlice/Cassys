import { validateNsName } from "../validators.ts";
import { DNSRecordType, IRecord } from "./types.ts";


export interface NSRecordOptions {
  target: string;
  ttl: number;
}

export class NSRecord implements IRecord {
  type: DNSRecordType = "NS";
  target: string;
  ttl: number = 3600;

  constructor(option: NSRecordOptions) {

    if (!validateNsName(option.target)) {
      throw new Error("Invalid Target value for NS Record");
    }
    this.target = option.target;
    this.ttl = option.ttl;
  }
}
