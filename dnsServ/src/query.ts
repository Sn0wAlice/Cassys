import { Buffer } from "../deps.ts";
import { decode, encode, QueryType } from "./protocol.ts";
import { IRecord } from "./records/types.ts";

function define(obj: any, prop: string, value: any) {
  Object.defineProperty(obj, prop, {
    value,
    enumerable: false,
  });
}

export interface Answer {
  name: string;
  rtype: number;
  rttl: number;
  rdata: IRecord;
}

/** Represents an DNS Query received by the server */
export class DNSQuery {
  id: string;
  name: string;
  type: string;
  truncated?: boolean;
  authoritative?: boolean;
  recursionAvailable?: boolean;
  _responseCode = 0;
  _qdCount!: number;
  _anCount!: number;
  _nsCount!: number;
  _srCount!: number;
  _flags: { [name: string]: number } = {};
  _question: any;
  _answers: Answer[] = [];
  _raw: Buffer | null = null;
  _client: Deno.NetAddr | null = null;
  _authority: any;
  _additional: any;
  _respond!: CallableFunction;

  constructor(data: any) {
    this.id = data.id;

    define(this, "_question", data.question);
    define(this, "_flags", data.flags);
    define(this, "_qdCount", data.qdCount);
    this._anCount = data.anCount ?? 0;
    define(this, "_nsCount", data.nsCount ?? 0);
    define(this, "_srCount", data.srCount ?? 0);

    this.name = data.question.name;
    this.type = QueryType[data.question.type];
  }

  get answers() {
    return this._answers.map((e) => ({
      name: e.name,
      type: QueryType[e.rtype],
      record: e.rdata,
      ttl: e.rttl,
    }));
  }

  get operation() {
    switch (this._flags.opcode) {
      case 0:
        return "query";
      case 2:
        return "status";
      case 4:
        return "notify";
      case 5:
        return "update";
      default:
        throw new Error("Invalid Operation ID: " + this._flags.opcode);
    }
  }

  encode() {
    const encoded = encode(
      {
        header: {
          id: this.id,
          flags: this._flags,
          qdCount: this._qdCount,
          anCount: this._anCount,
          nsCount: this._nsCount,
          srCount: this._srCount,
        },
        question: this._question,
        answers: this._answers,
        authority: this._authority,
        additional: this._additional,
      },
      "answerMessage"
    );
    this._raw = encoded;
    return this;
  }

  answer(record: IRecord | IRecord[], ttl?: number, name?: string) {
    if (Array.isArray(record)) {
      record.forEach((r) => {
        this.answer(r, ttl, name);
      });
      return this;
    }
    if (!name) name = this._question.name;
    if (typeof name !== "string") throw new Error("name must be string");
    if (typeof record !== "object") throw new Error("record must be IRecord");
    if (ttl !== undefined && typeof ttl !== "number")
      throw new Error("ttl must be number");

    if (typeof QueryType[record.type] !== "number")
      throw new Error("Unknown Record Type: " + record.type);

    const answer = {
      name,
      rtype: QueryType[record.type],
      rclass: 1,
      rttl: ttl ?? 5,
      rdata: record,
    };

    this._answers.push(answer);
    this._anCount++;
    return this;
  }

  async respond() {
    await this._respond();
    return this;
  }

  static parseRaw(raw: any, src: any) {
    let dobj,
      b = raw;
    dobj = decode(b, "queryMessage", 0);
    if (!dobj.val) return null;
    const d = dobj.val;

    return {
      id: d.header.id,
      flags: d.header.flags,
      qdCount: d.header.qdCount,
      anCount: d.header.anCount,
      nsCount: d.header.nsCount,
      srCount: d.header.srCount,
      question: d.question,
      src,
      raw,
    };
  }

  static create(req: any) {
    const query = new DNSQuery(req);
    query._raw = req._raw;
    query._client = req.src;
    return query;
  }
}
