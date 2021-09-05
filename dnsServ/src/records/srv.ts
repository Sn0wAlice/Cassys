import { validateNsText, validateUint16BE } from "../validators.ts";
import { DNSRecordType, IRecord } from "./types.ts";

export interface SRVRecordOptions {
  host: string;
  port: number;
  priority?: number;
  weight?: number;
}

export class SRVRecord implements IRecord {
  type: DNSRecordType = "SRV";
  target: string;
  port: number;
  priority: number = 0;
  weight: number = 10;

  constructor(options: SRVRecordOptions) {
    if (!validateNsText(options.host))
      throw new Error("Invalid host name for SRV Record");
    if (!validateUint16BE(options.port))
      throw new Error("Invalid port for SRV Record");
    const weight = options.weight ?? this.weight;
    if (!validateUint16BE(weight))
      throw new Error("Invalid weight value for SRV Record");
    const priority = options.priority ?? this.priority;
    if (!validateUint16BE(priority))
      throw new Error("Invalid priority value for SRV Record");

    this.target = options.host;
    this.port = options.port;
    this.weight = weight;
    this.priority = priority;
  }
}
