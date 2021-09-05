import * as IPv6 from "../../deps.ts";
import { DNSRecordType, IRecord } from "./types.ts";

export class AAAARecord implements IRecord {
  type: DNSRecordType = "AAAA";
  target: string;

  constructor(ip: string | IPv6) {
    if (typeof ip === "object" && ip instanceof IPv6)
      this.target = ip.toString();
    else {
      if (!IPv6.IPv6.isIPv6(ip))
        throw new Error("Expected valid IPv6 Arress for AAAA Record");
      this.target = ip;
    }
  }
}
