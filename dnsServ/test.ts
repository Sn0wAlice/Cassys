import {
  AAAARecord,
  DNSServer,
  MXRecord,
  NSRecord,
  SOARecord,
  ARecord,
  CNAMERecord,
  TXTRecord,
  SRVRecord,
} from "./mod.ts";
import { assertEquals } from "https://deno.land/std@0.90.0/testing/asserts.ts";

const server = new DNSServer({
  txt: new TXTRecord("txt"),
  cname: new CNAMERecord("google.com"),
  a: new ARecord("127.0.0.1"),
  aaaa: new AAAARecord("2001:6db8:10b8:20b8:30b8:40b8:3257:9652"),
  mx: new MXRecord({
    exchange: "mail.example.com",
    ttl: 1936,
  }),
  ns: new NSRecord("ns.example.com"),
  soa: new SOARecord({
    host: "soa.example.com",
  }),
  srv: new SRVRecord({
    host: "voip.example.com",
    port: 6969,
  }),
});

server.on("listen", () => {
  console.log("Listening!");
});

server.listen({ port: 6969 });

const nameServer = {
  ipAddr: "127.0.0.1",
  port: 6969,
};

const options: Deno.ResolveDnsOptions = { nameServer };

Deno.test({
  name: "TXT Record",
  async fn() {
    const res = await Deno.resolveDns("txt", "TXT", options);
    assertEquals(res.length, 1);
    assertEquals(res[0].length, 1);
    assertEquals(res[0][0], "txt");
  },
});

Deno.test({
  name: "A Record",
  async fn() {
    const res = await Deno.resolveDns("a", "A", options);
    assertEquals(res.length, 1);
    assertEquals(res[0], "127.0.0.1");
  },
});

Deno.test({
  name: "AAAA Record",
  async fn() {
    const res = await Deno.resolveDns("aaaa", "AAAA", options);
    assertEquals(res.length, 1);
    assertEquals(res[0], "2001:6db8:10b8:20b8:30b8:40b8:3257:9652");
  },
});

Deno.test({
  name: "MX Record",
  async fn() {
    const res = await Deno.resolveDns("mx", "MX", options);
    assertEquals(res.length, 1);
    assertEquals(res[0].exchange, "mail.example.com.");
  },
});

Deno.test({
  name: "CNAME Record",
  async fn() {
    const res = await Deno.resolveDns("cname", "CNAME", options);
    assertEquals(res.length, 1);
    assertEquals(res[0], "google.com.");
  },
});

Deno.test({
  name: "SRV Record",
  async fn() {
    const res = await Deno.resolveDns("srv", "SRV", options);
    assertEquals(res.length, 1);
    assertEquals(res[0].target, "voip.example.com.");
    assertEquals(res[0].port, 6969);
  },
});

Deno.test({
  name: "Clean Up",
  sanitizeResources: false,
  sanitizeOps: false,
  fn() {
    server.close();
  },
});
