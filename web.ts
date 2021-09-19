import { listenAndServe } from "https://deno.land/std@0.107.0/http/server.ts";

let config = JSON.parse(Deno.readTextFileSync("./config.json")).web;
const addr = `:${config.port}`;

const handler = (request: Request): Response => {

    let response = { body:"" }
    response.body = "Cassys";

    return new Response(response.body, { status: 200 });
};

console.log(`Cassys webserver running. Access it at: ${config.port}:${config.host}`);
await listenAndServe(addr, handler);