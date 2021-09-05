import { DNSServer, ARecord, AAAARecord, CNAMERecord, MXRecord, NSRecord, SOARecord, SRVRecord, TXTRecord} from "./dnsServ/mod.ts";
import { welcome } from "./utils/welcome.ts";
welcome()

import { PrintConfs } from "./utils/printConfs.ts";
import { MakeAResponse } from "./record/a.ts";

const _MakeAResponse = new MakeAResponse()
const _PrintConfs = new PrintConfs()

async function MakeRecord() {
  let records = []
  for(let i=0; i<record.length; i++) {
    records.push(record[i].url)
  }
  return records
}

//See exemple in ./Demame/test.ts
const server = new DNSServer({
  "pc2.me": new ARecord("127.0.0.1"),
})

/*
exemple of record
{
  "txt.google.com": new TXTRecord("txt"),
  "cname.google.com": new CNAMERecord("google.com"),
  "google.com": new ARecord("127.0.0.1"),
  "v6.google.com": new AAAARecord("2001:6db8:10b8:20b8:30b8:40b8:3257:9652"),
  "mx.google.com": new MXRecord({exchange: "mail.example.com",ttl: 1936}),
  "ns.google.com": new NSRecord("ns.example.com"),
  "soa.google.com": new SOARecord({host: "soa.example.com"}),
  "srv.google.com": new SRVRecord({host: "voip.example.com",port: 6969,}),
}
*/


let record = JSON.parse(Deno.readTextFileSync("config.json"))
let recordName = await MakeRecord()
await _PrintConfs.printConfs(record)


server.on("listen", () => {
  console.log("\nListening ~");
});

server.listen({ port: 6969, script: async function main(query, thisServer) {
  try{
    if(recordName.includes(query.name)) {
      if(query.type == "A"){
        let target = await _MakeAResponse.make(query, record[recordName.indexOf(query.name)])
        thisServer.records[query.name] = [{record: new ARecord(target) }]
      }
    } else {
      console.log(`No record for the query: ${query.name}`)
    }
  } catch(e) {
    console.log(e)
  }
  return {this: thisServer, query: query};
}});