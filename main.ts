import { welcome } from "./utils/welcome.ts"; 

// Execute Command
async function Execute(commande: any) {
  let content = "";
  let comcmd = commande.split(' ')
  let p = Deno.run({cmd: comcmd, stdout: "inherit"});

  let { code } = await p.status();
  if (code === 0) {
    let rawOutput = await p.output();
    content = new TextDecoder().decode(rawOutput);
  }
  return content
}


// +---------------------+
// | Launch all the apps |
// +---------------------+

//Launch the DNS
async function Cassys_DNS() {
  if(Deno.args.indexOf('--no-DNS') == -1){
    while (true) {
      try{
        console.log(`[Cassys] - [Launch] - ${Date.now()} - DNS Server`)
        await Execute("deno run -A --unstable --no-check dns.ts")
      } catch(err){
        console.log(err)
      }
    }
  }
}

//Launch the Web
async function Cassys_WEB() {
  if(Deno.args.indexOf('--no-WEB') == -1){
    while (true) {
      try{
        console.log(`[Cassys] - [Launch] - ${Date.now()} - Web Server`)
        await Execute("deno run -A --unstable --no-check web.ts")
      } catch(err){
        console.log(err)
      }
    }
  }
}

//Launch the API
async function Cassys_API() {
  if(Deno.args.indexOf('--no-API') == -1){
    while (true) {
      try{
        console.log(`[Cassys] - [Launch] - ${Date.now()} - API Server`)
        await Execute("deno run -A --unstable --no-check api.ts")
      } catch(err){
        console.log(err)
      }
    }
  }
}

//Launch the ProxyByPassClient
async function ProxyByPassClient() {
  while (true) {
    try{
      console.log(`[Cassys] - [Launch] - ${Date.now()} - ProxyByPassClient`)
      await Execute("deno run -A --unstable --no-check ./record/DNS_exfil/client.ts")
    } catch(err){
      console.log(err)
    }
  }
}


async function cleanTXTCache() {
  try{
    await Execute(`rm -r ./record/bypass/`)
  } catch(err){}
  try{
    await Execute(`mkdir ./record/bypass/`)
  } catch(err){}
  console.log(`[Cassys] - [Launch] - ${Date.now()} - TXT caches is clean`)
}

//Base welcome
welcome()
await cleanTXTCache()

//Launch the DNS
if(Deno.args.indexOf('--ProxyPass') > -1){
  ProxyByPassClient()
} else {
  Cassys_DNS();
  Cassys_WEB();
  Cassys_API();
}
