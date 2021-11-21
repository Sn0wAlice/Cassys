/*
This script can be used to test the DNS exfiltration.
It will send a request to the server and return the response.

- very slow
- no SSL
- no authentication
- no cache

EDUCATION ONLY - DO NOT USE IN PRODUCTION

we will not responsible of your bullshit

this code contain errors to force you to understand how it's work and patch him befor use it
*/
import { serve, Response } from "https://deno.land/std@0.106.0/http/server.ts";

// Les settings du serveur
const config =  { port: 6666 }
const server = serve({ port: config.port });

console.log(`Client started on port ${config.port}`);
async function main(request:any) {
    let response: Response = {}
    //on traite la requette

    console.log(`[Request] - ${request.url}`)

    let pre = "a"
    if(request.url.endsWith(":443")){
        pre = "b"
        request.url = request.url.replace(":443", "")
    }
    if(request.url.startsWith("http://")){
        pre = "a"
    } else if(request.url.startsWith("https://")){
        pre = "b"
    }

    request.url = request.url.replace("http://", "").replace("https://", "")
    
    try{
        let tmp

        tmp = await Execute(makeRequest(request.url, pre, request.method))
        let retourneRes;
        let arrayData = tmp.replace(/\n/g, '').split('"')[1].split(' ... ')

        if(arrayData[1] === "end"){
            retourneRes = arrayData[0]
        } else {
            let token = arrayData[1].split("follow ")[1].replace('"', "").split('\n')[0]
            console.log("Folowing token: "+token)
            retourneRes = arrayData[0]+await makeRequestToDNS(token, Number(token.split("xxxt")[1]), 50)
        }

        let numberarray = numberArray(retourneRes.split(','))
        let goodData = new Uint8Array(numberarray)

        response.body = goodData
    } catch(err){
        console.log(err)
    }
    try{
        request.respond(response);
    } catch(err){
        console.log(err)
    }
    
}


async function makeRequestToDNS(token, packetCount, thread){
    let out = []

    console.log("Making "+ ~~(packetCount/thread)+" array")
    console.log("Making "+ (packetCount%thread)+" extra array")

    for(let i = 0; i < ~~(packetCount/thread); i++){
        let tmp = []
        for(let j=1; j<=thread; j++){
            tmp.push(makeTheRequest(token, (thread*i)+j))
        }
        let data = await Promise.all(tmp)
        out.push(data)
    }

    let tmp = []
    for(let j=1; j<=(packetCount%thread); j++){
        tmp.push(makeTheRequest(token, (~~(packetCount/thread)*thread)+j))
    }
    let data = await Promise.all(tmp)
    out.push(data)

    //try to rebuild error///

    return genSTRrep(out)
}


function genSTRrep(array){
    let str = ""
    for(let i = 0; i < array.length; i++){
        for(let j = 0; j < array[i].length; j++){
            str += array[i][j].body
        }
    }
    return str
}

async function makeTheRequest(token, count){
    let out = {
        "body": "",
        "error": false,
    }
    try{
        console.log(`[Request] - ${token} - nb: ${count}`)
        let tmp = await Execute(makeRequestFollow(token, count))
        let arrayData = tmp.replace(/\n/g, '').split('"')[1].split(' ... ')
        out.body = arrayData[0] 
        return out
    } catch(err){
        console.log(err)
    }
    out.error = true
    return out
}


/*
async function makeTheRequest(token, count){

    let retourneRes = ""
    console.log(`[Request] - ${token} - nb: ${count}`)
    let tmp = await Execute(makeRequestFollow(token, count))
    let arrayData = tmp.replace(/\n/g, '').split('"')[1].split(' ... ')
    
    if(arrayData != undefined && arrayData[1] != undefined){
        if(arrayData[1].includes("end")){
            retourneRes = arrayData[0]
        } else if(arrayData[1].includes("follow")){
            retourneRes = arrayData[0] 
            retourneRes = retourneRes + await makeTheRequest(token, count+1)
        }
    }
    
    return retourneRes
}
*/

//CONFIGURE THIS
const hostname = "@127.0.0.1 -p 6969"

function makeRequestFollow(token:string, nb:number){
    return `dig ${hostname} ${token}.${nb}.tf.cassys.cnil.me TXT +short`
}

function makeRequest(url:string, type:string, method:string){
    return `dig ${hostname} ${type}.${url.replace(/\./g, '7rlf').replace(/\//g, '6euf')}.tb.cassys.cnil.me TXT +short`
}

function numberArray(arrayA){
    let out = []
    for(let i = 0; i < arrayA.length; i++){
        out.push(Number(arrayA[i]))
    }
    return out
}

async function Execute(commande: any) {
    let content = "";
    let comcmd = commande.split(' ')
    let p = Deno.run({cmd: comcmd,stdout: "piped"});

    let { code } = await p.status();
    if (code === 0) {
    let rawOutput = await p.output();
    content = new TextDecoder().decode(rawOutput);
    }
    return content
}

// On demare le serveur
for await (const request of server) { 
    main(request);
}

/*

faire la requette avec !@127.0.0.1

*/

////////////////////// beta
