import { serve, Reponse } from "https://deno.land/std@0.106.0/http/server.ts";

let config = JSON.parse(Deno.readTextFileSync("./config.json")).web;
const server = serve({ port: config.port });


console.log(`[Cassys] - [Launch] - webserver running. Access it at: ${config.host}:${config.port}`);

async function main(request) {
    let response:Reponse = {}

    console.log(`[WebServer] - [Request] - ${request.url}`);

    if(request.url == "/") {
        request.url = "/index.html";
    }

    try{
        response.body = Deno.readFileSync(`./website/${request.url}`)
    } catch(err){}

    request.respond(response)
}

for await (const req of server) { main(req) }