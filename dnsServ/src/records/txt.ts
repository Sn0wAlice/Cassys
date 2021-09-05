import { validateNsText } from "../validators.ts";
import { DNSRecordType, IRecord } from "./types.ts";

export class TXTRecord implements IRecord {
  type: DNSRecordType = "TXT";
  target: string;

  constructor(target: string) {
    if (!validateNsText(target)) throw new Error("Invalid TXT Record Value");
    this.target = target;
  }
}
