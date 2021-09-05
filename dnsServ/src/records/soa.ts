import { validateNsName, validateUint32BE } from "../validators.ts";
import { DNSRecordType, IRecord } from "./types.ts";

export interface SOARecordOptions {
  host: string;
  admin?: string;
  serial?: number;
  retry?: number;
  expire?: number;
  ttl?: number;
  refresh?: number;
}

export class SOARecord implements IRecord {
  type: DNSRecordType = "SOA";
  target: void;
  host: string;
  admin: string;
  serial: number;
  retry: number;
  expire: number;
  ttl: number;
  refresh: number;

  constructor(options: SOARecordOptions) {
    if (!validateNsName(options.host))
      throw new Error("Invalid host name for SOA Record");

    const admin = options.admin ?? "hostmaster." + options.host;
    if (!validateNsName(admin)) throw new Error("Invalid Admin for SOA Record");

    const serial = options.serial ?? 0;
    const refresh = options.refresh ?? 10;
    const retry = options.retry ?? 10;
    const expire = options.expire ?? 10;
    const ttl = options.ttl ?? 10;

    if (!validateUint32BE(serial))
      throw new Error("Invalid serial for SOA Record");
    if (!validateUint32BE(refresh))
      throw new Error("Invalid refresh value for SOA Record");
    if (!validateUint32BE(retry))
      throw new Error("Invalid retry value for SOA Record");
    if (!validateUint32BE(expire))
      throw new Error("Invalid expire value for SOA Record");
    if (!validateUint32BE(ttl))
      throw new Error("Invalid ttl value for SOA Record");

    this.host = options.host;
    this.admin = admin;
    this.serial = serial;
    this.refresh = refresh;
    this.retry = retry;
    this.expire = expire;
    this.ttl = ttl;
  }
}
