import { Buffer } from "../deps.ts";
import * as IPv6 from "../deps.ts";

export enum Constants {
  QCLASS_IN = 0x01, // the internet
  QCLASS_CS = 0x02, // obsolete
  QCLASS_CH = 0x03, // chaos class. yes this actually exists
  QCLASS_HS = 0x04, // Hesiod
  DNS_ENOERR = 0x00, // No error
  DNS_EFORMAT = 0x01, // Formatting Error
  DNS_ESERVER = 0x02, // server it unable to process
  DNS_ENONAME = 0x03, // name does not exist
  DNS_ENOTIMP = 0x04, // feature not implemented on this server
  DNS_EREFUSE = 0x05, // refused for policy reasons
}

export const Formats: {
  [name: string]: {
    [name: string]: { type: string | { format: string } };
  };
} = {
  answer: {
    name: { type: "_nsName" },
    rtype: { type: "UInt16BE" },
    rclass: { type: "UInt16BE" },
    rttl: { type: "UInt32BE" },
    rdata: { type: "_nsData" },
  },
  question: {
    name: { type: "_nsName" },
    type: { type: "UInt16BE" },
    qclass: { type: "UInt16BE" },
  },
  header: {
    id: { type: "UInt16BE" },
    flags: { type: "_nsFlags" },
    qdCount: { type: "UInt16BE" },
    anCount: { type: "UInt16BE" },
    nsCount: { type: "UInt16BE" },
    srCount: { type: "UInt16BE" },
  },
  soa: {
    host: { type: "_nsName" },
    admin: { type: "_nsName" },
    serial: { type: "UInt32BE" },
    refresh: { type: "UInt32BE" },
    retry: { type: "UInt32BE" },
    expire: { type: "UInt32BE" },
    ttl: { type: "UInt32BE" },
  },
  mx: {
    priority: { type: "UInt16BE" },
    exchange: { type: "_nsName" },
  },
  txt: {
    text: { type: "_nsText" },
  },
  srv: {
    priority: { type: "UInt16BE" },
    weight: { type: "UInt16BE" },
    port: { type: "UInt16BE" },
    target: { type: "_nsName" },
  },
  queryMessage: {
    header: { type: { format: "header" } },
    question: { type: { format: "question" } },
  },
  answerMessage: {
    header: { type: { format: "header" } },
    question: { type: { format: "question" } },
    answers: { type: "_nsAnswers" },
  },
};

export function convertIPv4ToUint(addr: string) {
  if (typeof addr !== "string") throw new Error("addr must be string");
  const octets = addr.split(/\./).map((octet) => parseInt(octet, 10));
  if (octets.length !== 4 || octets.some((e) => isNaN(e)))
    throw new Error("Invalid addr");

  return (
    octets[0] * Math.pow(256, 3) +
    octets[1] * Math.pow(256, 2) +
    octets[2] * 256 +
    octets[3]
  );
}

export function convertIPv6ToArray(addr: string) {
  if (typeof addr !== "string") throw new Error("addr must be string");
  let res;
  try {
    res = IPv6.parse(addr);
  } catch (e) {
    return null;
  }
  return res.parts;
}

const Serializers = {
  UInt32BE: {
    encoder(v: number) {
      const b = new Buffer(4);
      b.writeUInt32BE(v, 0);
      return b;
    },
    decoder(v: Buffer, p: number) {
      return v.readUInt32BE(p);
    },
  },
  UInt16BE: {
    encoder(v: number) {
      const b = new Buffer(2);
      b.writeUInt16BE(v, 0);
      return b;
    },
    decoder(v: Buffer, p: number) {
      const res = v.readUInt16BE(p);
      return { val: res, len: 2 };
    },
  },
  _nsAnswers: {
    encoder(v: Buffer) {
      let s = 0,
        p = 0,
        answers = [];
      for (const i in v) {
        let r = encode(v[i], "answer");
        answers.push(r);
        s = s + r.length;
      }
      const b = new Buffer(s);
      for (const n in answers) {
        answers[n].copy(b, p);
        p = p + answers[n].length;
      }
      return b;
    },
  },
  _nsFlags: {
    encoder: function (v: any) {
      if (typeof v !== "object") {
        throw new TypeError("flag must be an object");
      }
      let b = new Buffer(2);
      let f = 0x0000;
      f = f | (v.qr << 15);
      f = f | (v.opcode << 11);
      f = f | (v.aa << 10);
      f = f | (v.tc << 9);
      f = f | (v.rd << 8);
      f = f | (v.ra << 7);
      f = f | (v.z << 6);
      f = f | (v.ad << 5);
      f = f | (v.cd << 4);
      f = f | v.rcode;
      b.writeUInt16BE(f, 0);
      return b;
    },
    decoder(v: Buffer, p: number) {
      let flags, f;
      flags = v.readUInt16BE(p);
      f = {
        qr: flags & 0x8000 ? true : false,
        opcode: flags & 0x7800,
        aa: flags & 0x0400 ? true : false,
        tc: flags & 0x0200 ? true : false,
        rd: flags & 0x0100 ? true : false,
        ra: flags & 0x0080 ? true : false,
        z: flags & 0x0040 ? true : false,
        ad: flags & 0x0020 ? true : false,
        cd: flags & 0x0010 ? true : false,
        rcode: flags & 0x000f,
      };
      return { val: f, len: 2 };
    },
  },
  _nsIP4: {
    encoder(v: string) {
      let a, b;
      a = convertIPv4ToUint(v);
      b = new Buffer(4);
      b.writeUInt32BE(a, 0);
      return b;
    },
  },
  _nsIP6: {
    encoder(v: string) {
      let a,
        b,
        i = 0;
      a = convertIPv6ToArray(v);
      b = new Buffer(16);
      for (let i = 0; i < 8; i++) {
        b.writeUInt16BE(a![i], i * 2);
      }
      return b;
    },
  },
  _nsName: {
    encoder(v: string) {
      if (typeof v !== "string")
        throw new TypeError("name (string) is required");
      let n = v.split(/\./);

      let b = new Buffer(n.toString().length + 2);
      let o = 0; // offset

      for (let i = 0; i < n.length; i++) {
        let l = n[i].length;
        b[o] = l;
        b.write(n[i], ++o, l);
        o += l;
      }
      b[o] = 0x00;

      return b;
    },
    decoder(v: Buffer, p: number) {
      let rlen,
        start = p,
        name = [];

      rlen = v.readUInt8(p);
      while (rlen != 0x00) {
        p++;
        let t = v.slice(p, p + rlen);
        name.push(t.toString());
        p = p + rlen;
        rlen = v.readUInt8(p);
      }

      return { val: name.join("."), len: p - start + 1 };
    },
  },
  _nsText: {
    encoder(v: string) {
      let b;
      b = new Buffer(v.length + 1);
      b.writeUInt8(v.length, 0);
      b.write(v, 1);
      return b;
    },
  },
  _nsData: {
    encoder(v: any, t: number) {
      let r, b, l;

      switch (t) {
        case QueryType.A:
          r = Serializers["_nsIP4"].encoder(v.target);
          break;
        case QueryType.CNAME:
          r = Serializers["_nsName"].encoder(v.target);
          break;
        case QueryType.NS:
          r = Serializers["_nsName"].encoder(v.target);
          break;
        case QueryType.SOA:
          r = encode(v, "soa");
          break;
        case QueryType.MX:
          r = encode(v, "mx");
          break;
        case QueryType.TXT:
          r = Serializers["_nsText"].encoder(v.target);
          break;
        case QueryType.AAAA:
          r = Serializers["_nsIP6"].encoder(v.target);
          break;
        case QueryType.SRV:
          r = encode(v, "srv");
          break;
        default:
          throw new Error("unrecognized nsdata type");
      }

      l = r.length;
      b = new Buffer(l + 2);
      b.writeUInt16BE(l, 0);
      r.copy(b, 2);
      return b;
    },
  },
};

export enum QueryType {
  A = 0x01,
  NS = 0x02,
  MD = 0x03,
  MF = 0x04,
  CNAME = 0x05,
  SOA = 0x06,
  MB = 0x07,
  MG = 0x08,
  MR = 0x09,
  NULL = 0x0a,
  WKS = 0x0b,
  PTR = 0x0c,
  HINFO = 0x0d,
  MINFO = 0x0e,
  MX = 0x0f,
  TXT = 0x10,
  AAAA = 0x1c,
  SRV = 0x21,
  AXFR = 0xfc,
  MAILA = 0xfe,
  MAILB = 0xfd,
  ANY = 0xff,
}

export function encode(obj: any, format: string) {
  let size = 0,
    pos = 0,
    fmt,
    result,
    results = [];

  fmt = Formats[format];

  for (const f in fmt) {
    let type, res;
    type = fmt[f].type;

    if (typeof type === "string") {
      if (type == "_nsData") {
        res = Serializers["_nsData"].encoder(obj[f], obj["rtype"]);
      } else {
        res = (Serializers as any)[type].encoder(obj[f]);
      }
    } else if (typeof type === "object") {
      const refType = type.format;
      res = encode(obj[f], refType);
    } else {
      throw new TypeError("invalid type");
    }

    results.push(res);
    size = size + res.length;
  }

  result = new Buffer(size);

  for (const i in results) {
    let buf = results[i];
    buf.copy(result, pos);
    pos = pos + buf.length;
  }

  return result;
}

export function decode(raw: string, format: string, pos: number) {
  let fmt,
    result: any = {};

  if (!pos) pos = 0;
  fmt = Formats[format];

  for (let f in fmt) {
    let type, res;
    type = fmt[f].type;

    if (typeof type === "string") {
      res = (Serializers as any)[type].decoder(raw, pos);
    } else if (typeof type === "object") {
      const reftype = type.format;
      res = decode(raw, reftype, pos);
    } else {
      throw new TypeError("invalid type");
    }

    pos += res.len;
    result[f] = res.val;
  }

  return { val: result, len: pos };
}

export const DNS_ENOERR = 0x00,
  DNS_EFORMAT = 0x01,
  DNS_ESERVER = 0x02,
  DNS_ENONAME = 0x03,
  DNS_ENOTIMP = 0x04,
  DNS_EREFUSE = 0x05;
