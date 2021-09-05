import { validateNsName } from "../validators.ts";
import { DNSRecordType, IRecord } from "./types.ts";

export class NSRecord implements IRecord {
  type: DNSRecordType = "NS";
  target: string;

  constructor(target: string) {
    if (!validateNsName(target))
      throw new Error("Invalid Target value for NS Record");
    this.target = target;
  }
}
