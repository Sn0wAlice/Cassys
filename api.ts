import { serve, Reponse } from "https://deno.land/std@0.106.0/http/server.ts";

let config = JSON.parse(Deno.readTextFileSync("./config.json")).api;
const server = serve({ port: config.port });

import { APIController } from "./api/main.ts";

const _APIController = new APIController();

console.log(`[Cassys] - [Launch] - API running. Access it at: ${config.host}:${config.port}`);

async function main(request) {
    let response:Reponse = {}

    console.log(`[API] - [Request] - ${request.url}`);

    response = await _APIController.main(request);

    request.respond(response)
}

for await (const req of server) { main(req) }