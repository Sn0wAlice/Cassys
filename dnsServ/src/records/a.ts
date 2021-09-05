import * as IPv4 from "../../deps.ts";
import { DNSRecordType, IRecord } from "./types.ts";

export class ARecord implements IRecord {
  type: DNSRecordType = "A";
  target: string;

  constructor(ip: string | IPv4) {
    if (typeof ip === "object" && ip instanceof IPv4)
      this.target = ip.toString();
    else {
      if (!IPv4.IPv4.isIPv4(ip))
        throw new Error("Expected valid IPv4 Arress for A Record");
      this.target = ip;
    }
  }
}
