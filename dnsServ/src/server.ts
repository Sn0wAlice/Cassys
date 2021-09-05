import { Buffer, EventEmitter } from "../deps.ts";
import { DNSQuery } from "./query.ts";
import { IRecord } from "./records/types.ts";

export type RecordWithTTL = { record: IRecord; ttl?: number };
export type SavedRecord = {
  [name: string]: IRecord | IRecord[] | RecordWithTTL | RecordWithTTL[];
};

export type DNSServerEvents = {
  listen: [];
  clientError: [Error];
  error: [Error];
  close: [];
  query: [DNSQuery];
  uncaughtException: [Error];
};

export interface ListenOptions {
  port: number;
  script?: Function;
  address?: string;
}

export class DNSServer extends EventEmitter<DNSServerEvents> {
  socket?: Deno.DatagramConn;
  records: { [name: string]: RecordWithTTL[] } = {};

  constructor(records: SavedRecord = {}) {
    super();
    Object.entries(records).forEach(([name, rec]) => {
      if (Array.isArray(rec)) {
        rec.forEach((e: IRecord | RecordWithTTL) => this.register(name, e));
      } else {
        this.register(name, rec);
      }
    });

    this.on("query", async (query) => {
      try {
        if (this.records[query.name] !== undefined) {
          const res = this.records[query.name];
          res.forEach((e) => query.answer(e.record, e.ttl));
          await query.respond();
        }
      } catch (e) {
        this.emit("error", e);
      }
    });
  }

  register(name: string, record: IRecord | RecordWithTTL) {
    let records = this.records[name] ?? [];
    this.records[name] = records;
    if ((record as RecordWithTTL).record !== undefined) {
      records.push(record as RecordWithTTL);
    } else {
      records.push({ record: record as IRecord });
    }
    return this;
  }

  close() {
    this.socket?.close();
  }

  async listen(options: ListenOptions) {
    this.socket = Deno.listenDatagram({
      port: options.port,
      transport: "udp",
      hostname: options.address ?? "0.0.0.0",
    });

    this.emit("listen");
    try {
      for await (const [_buf, addr] of this.socket) {
        const buffer = new Buffer(_buf);
        let query: DNSQuery;

        try {
          query = DNSQuery.create(DNSQuery.parseRaw(buffer, addr));
        } catch (e) {
          this.emit("clientError", new Error(`Invalid DNS Datagram`));
          continue;
        }

        //added for debugging

        if (query === undefined || query === null) {
          continue;
        }

        let self = this;
        if(options.script !== undefined){
          let response = await options.script(query, self);
          self = response.this;
          query = response.query;
        }

        query._respond = async function () {
          await self.send(query);
        };

        self.emit("query", query);
      }
    } catch (e) {
      this.emit("error", e);
    }

    this.emit("close");
  }

  async send(res: DNSQuery) {
    if (!this.socket) throw new Error("Not listening");

    try {
      res._flags.qr = 1;
      res.encode();
    } catch (e) {
      this.emit("uncaughtException", new Error("Unable to encode response"));
      return;
    }

    const buf = res._raw!;

    await this.socket.send(buf, res._client!);
    return this;
  }
}
