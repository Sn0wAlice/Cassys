import { DNSServer, ARecord, AAAARecord, CNAMERecord, MXRecord, NSRecord, SOARecord, SRVRecord, TXTRecord} from "./dnsServ/mod.ts";
import { TorNodes } from "./utils/torNodes.ts";
import { UtilsFunction } from "./utils/funtion.ts";

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

const _UtilsFunction = new UtilsFunction()
const _TorNodes = new TorNodes()

//See exemple in ./Demame/test.ts
const server = new DNSServer({})

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

await _TorNodes.dlTorNodes()

let TorNodesArray = Deno.readTextFileSync("./utils/torNodes.txt").split('\n')

server.on("listen", () => { console.log("\nListening ~") });

server.listen({ port: 6969, script: async function main(query, thisServer) {
  try{
    query.name = query.name.toLowerCase()
	  console.log(`[${query._client.hostname}] - request  - ${query.name} - ${query.type}`)
    if(TorNodesArray.includes(query._client.hostname)) {
      query.ontor = true
    } else {
      query.ontor = false
    }

    let breakTheLoop = false
    let recordData

    try{
      if(["version.bind"].indexOf(query.name) > -1) {
        // a faire
        breakTheLoop = true
        if(query.name === "version.bind"){
          thisServer.records[query.name] = [{record: new TXTRecord(Deno.readTextFileSync("./VERSION"))}]
        }
      } else {
        recordData = JSON.parse(Deno.readTextFileSync(await _UtilsFunction.genFileLocation(query.name)+"/"+query.type+".json"))
      }
    } catch(e) { 
      breakTheLoop = true
      thisServer.records[query.name] = [{record: "" }] 
    }

    // On teste les Exception de tor
    if(!breakTheLoop) {
      try{
        if(query.ontor && recordData.TorUserBanned) {
          //not allowed
          breakTheLoop = true
        } 
      } catch(err){
        breakTheLoop = true
      }
    }
    
    // On traite les requetes
    if(!breakTheLoop) {
      if(query.type == "A"){
        let target = await _MakeAResponse.make(query, recordData)
        thisServer.records[query.name] = [{record: new ARecord(target) }]

      } else if(query.type == "AAAA"){
        let target = await _MakeAAAAResponse.make(query, recordData)
        thisServer.records[query.name] = [{record: new AAAARecord(target) }]

      } else if(query.type == "CNAME"){
        let target = await _MakeCNAMEResponse.make(query, recordData)
        thisServer.records[query.name] = [{record: new CNAMERecord(target) }]

      } else if(query.type == "MX"){
        let target = await _MakeMXResponse.make(query, recordData)
        thisServer.records[query.name] = [{record: new MXRecord({exchange: target.host,ttl: target.port}) }]

      } else if(query.type == "NS"){
        let target = await _MakeNSResponse.make(query, recordData)
        thisServer.records[query.name] = [{record: new NSRecord({target: target, ttl: 3600}) }]

      } else if(query.type == "SOA"){
        let target = await _MakeSOAResponse.make(query, recordData)
        thisServer.records[query.name] = [{record: new SOARecord({host: target}) }]

      } else if(query.type == "SRV"){
        let target = await _MakeSRVResponse.make(query, recordData)
        thisServer.records[query.name] = [{record: new SRVRecord({host: target.host,port: target.port})}]

      } else if(query.type == "TXT"){
        let target = await _MakeTXTResponse.make(query, recordData)
        thisServer.records[query.name] = [{record: new TXTRecord(target)}]
      }

      if(Deno.args.indexOf("--debug") != -1){
        console.log(JSON.stringify(thisServer))
      }
      
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
