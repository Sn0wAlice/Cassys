import { DNSServer, ARecord, AAAARecord, CNAMERecord, MXRecord, NSRecord, SOARecord, SRVRecord, TXTRecord} from "./dnsServ/mod.ts";
import { welcome } from "./utils/welcome.ts";
import { TorNodes } from "./utils/torNodes.ts";
welcome()

import { PrintConfs } from "./utils/printConfs.ts";
import { MakeAResponse } from "./record/a.ts";
import { MakeAAAAResponse } from "./record/aaaa.ts";
import { MakeCNAMEResponse } from "./record/cname.ts";
import { MakeMXResponse } from "./record/mx.ts";
import { MakeNSResponse } from "./record/ns.ts";
import { MakeSOAResponse } from "./record/soa.ts";
import { MakeSRVResponse } from "./record/srv.ts";
import { MakeTXTResponse } from "./record/txt.ts"


const _MakeAResponse = new MakeAResponse()
const _MakeAAAAResponse = new MakeAAAAResponse()
const _MakeCNAMEResponse = new MakeCNAMEResponse()
const _MakeMXResponse = new MakeMXResponse()
const _MakeNSResponse = new MakeNSResponse()
const _MakeSOAResponse = new MakeSOAResponse()
const _MakeSRVResponse = new MakeSRVResponse()
const _MakeTXTResponse = new MakeTXTResponse()


const _TorNodes = new TorNodes()
const _PrintConfs = new PrintConfs()

async function MakeRecord() {
  let records = []
  for(let i=0; i<record.length; i++) {
    records.push({url: record[i].url, type: record[i].type})
  }
  return records
}

//See exemple in ./Demame/test.ts
const server = new DNSServer({
  "pc2.me": new ARecord("127.0.0.1"),
})

async function getIndex(url, type) {
  for(let i=0; i<recordName.length; i++){
    if(recordName[i].url === url && recordName[i].type === type){
      return i
    }
  }
  return -1
}

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

console.log(recordName)

await _PrintConfs.printConfs(record)
await _TorNodes.dlTorNodes()

let TorNodesArray = Deno.readTextFileSync("./utils/torNodes.txt").split('\n')

server.on("listen", () => {
  console.log("\nListening ~");
});

server.listen({ port: 6969, script: async function main(query, thisServer) {
  try{
    
    if(TorNodesArray.includes(query._client.hostname)) {
      query.ontor = true
    } else {
      query.ontor = false
    }

    let indexOfTheurl = await getIndex(query.name, query.type)

    if((query.ontor && record[recordName.indexOf(query.name)].TorUserBanned) || indexOfTheurl == -1) {
      //not allowed
    } else {
      if(query.type == "A"){
        let target = await _MakeAResponse.make(query, record[indexOfTheurl])
        thisServer.records[query.name] = [{record: new ARecord(target) }]

      } else if(query.type == "AAAA"){
        let target = await _MakeAAAAResponse.make(query, record[indexOfTheurl])
        thisServer.records[query.name] = [{record: new AAAARecord(target) }]

      } else if(query.type == "CNAME"){
        let target = await _MakeCNAMEResponse.make(query, record[indexOfTheurl])
        thisServer.records[query.name] = [{record: new CNAMERecord(target) }]

      } else if(query.type == "MX"){
        let target = await _MakeMXResponse.make(query, record[indexOfTheurl])
        thisServer.records[query.name] = [{record: new ARecord(target) }]

      } else if(query.type == "NS"){
        let target = await _MakeNSResponse.make(query, record[indexOfTheurl])
        thisServer.records[query.name] = [{record: new NSRecord(target) }]

      } else if(query.type == "SOA"){
        let target = await _MakeSOAResponse.make(query, record[indexOfTheurl])
        thisServer.records[query.name] = [{record: new SOARecord({host: target}) }]

      } else if(query.type == "SRV"){
        let target = await _MakeSRVResponse.make(query, record[indexOfTheurl])
        thisServer.records[query.name] = [{record: new SRVRecord({host: target.host,port: target.port})}]

      } else if(query.type == "TXT"){
        let target = await _MakeTXTResponse.make(query, record[indexOfTheurl])
        thisServer.records[query.name] = [{record: new TXTRecord(target) }]
      }

      console.log(JSON.stringify(thisServer))
    }
  } catch(e) {
    console.log(e)
  }
  try {
    return {this: thisServer, query: query};
  } catch(e){
    console.log(e)
  }
}});