export enum DNSErrorCodes {
  NO_ERROR,
  PROTOCOL_ERROR,
  CANNOT_PROCESS,
  NO_NAME,
  NOT_IMPLEMENTED,
  REFUSED,
  EXCEPTION,
}

export class DNSError extends Error {
  constructor(msg: string, public code: DNSErrorCodes) {
    super(msg);
  }
}
