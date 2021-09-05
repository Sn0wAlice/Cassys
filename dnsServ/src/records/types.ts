export type DNSRecordType =
  | "A"
  | "AAAA"
  | "CNAME"
  | "MX"
  | "NS"
  | "SOA"
  | "SRV"
  | "TXT";

export interface IRecord {
  type: DNSRecordType;
  target: any;
}
