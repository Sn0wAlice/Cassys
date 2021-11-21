import { DNSServer, TXTRecord } from "./dnsServ/mod.ts";
const server = new DNSServer({})

console.log(Deno.readTextFileSync('./files/ascii.txt'))

let utils = {
    getRecordContent: await import("./utils/getRecordContent.ts"),
    genFiles: await import("./utils/genFiles.ts"),
    newDomain: await import("./utils/newDomain.ts"),
    countBalancerProba: await import("./utils/countBalancerProba.ts"),
    getViaProba: await import("./utils/getViaProba.ts")
}

let types_DNS, typeArray = [];
await typeLoader()

/*
{
  //"txt.google.com": new TXTRecord("txt"),
  //"cname.google.com": new CNAMERecord("google.com"),
  //"google.com": new ARecord("127.0.0.1"),
  //"v6.google.com": new AAAARecord("2001:6db8:10b8:20b8:30b8:40b8:3257:9652"),
  //"mx.google.com": new MXRecord({exchange: "mail.example.com",ttl: 1936}),
  //"ns.google.com": new NSRecord("ns.example.com"),
  //"soa.google.com": new SOARecord({host: "soa.example.com"}),
  //"srv.google.com": new SRVRecord({host: "voip.example.com",port: 6969,}),
}
*/

server.on("listen", () => { console.log("\nListening ~") });

server.listen({ port: 6969, script: async function main(query, thisServer) {
  let recordData, breakTheLoop = false;
  try{

    query.name = query.name.toLowerCase()
	  console.log(`[${query._client.hostname}] - request - ${query.name} - ${query.type}`)

    try{
        //all the special cases
        if(["version.bind"].indexOf(query.name) > -1) {
            breakTheLoop = true
            if(query.name === "version.bind"){
                thisServer.records[query.name] = [{record: new TXTRecord(Deno.readTextFileSync("./infos/vertion"))}]
            }
        } else {
            //////////////////////////faire le bypass system

            recordData = await utils.getRecordContent.main(query.name, query.type)
            if(recordData === 'e'){ 
              if(query.type === "TXT" && (query.name.includes(".tb.") || query.name.includes(".tf.") || query.name.includes("njbhj.morpheus."))){
                // DNS tunneling
              } else {
                breakTheLoop = true 
              }
            }
        }
    } catch(e) { breakTheLoop = true }

    // On traite les requetes
    if(!breakTheLoop) {
        // On regarde si le type de la requete est dans la liste des types
        let type = typeArray.find(typeReq => typeReq.type === query.type)
        if(type){
          thisServer.records[query.name] = await type.mod.main(query, recordData, utils)
        } else {
          console.log(`Record type ${type} is unknow`)
          breakTheLoop = true
        }
    }
  } catch(e) { breakTheLoop = true }

  if(breakTheLoop){
    thisServer.records[query.name] = [{record: "" }] 
  }

  // On envoie les reponses
  try { return {this: thisServer, query: query}; } 
  catch(e){ console.log(e) }
}});


// On charge les types
async function typeLoader(){
  types_DNS = JSON.parse(Deno.readTextFileSync("./type/conf.json"));
  let tmpArray = [];
  for(let i=0; i<types_DNS.length; i++){
    let data = types_DNS[i]
    data.mod = await import(`./type/${data.file_location}main.ts`)
    tmpArray.push(data)
    console.log(`Loaded DNS type: ${data.type}`)
  }
  typeArray = tmpArray
}

//Cron task
setInterval(() => { typeLoader() ;}, 60*5000)