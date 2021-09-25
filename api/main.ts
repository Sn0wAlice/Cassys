import { Reponse } from "https://deno.land/std@0.106.0/http/server.ts";
import { UtilsFunction } from '../utils/funtion.ts';


const _UtilsFunction = new UtilsFunction();


let conf = JSON.parse(Deno.readTextFileSync("./api/conf.json"));

export class APIController {
    async main(request:any){
        let response:Reponse = {}

        // Check de API key
        if(request.method != "POST"){
            response = {
                status: 400,
                body: "Bad request"
            }
            return response
        }
        try{
            let tmp = new TextDecoder().decode(await Deno.readAll(request.body));
            let body = JSON.parse(tmp);
            
            if(conf.key.indexOf(body.token)>-1){
                response.status = 200;
                if(request.url === "/add"){
                    await this.add(body.JSONcontent);
                    response.body = `Host ${body.JSONcontent.url} ${body.JSONcontent.type} added`
                } else if(request.url === "/remove"){
                    await this.remove(body.url);
                    response.body = `Host ${body.url} deleted`
                }
            } else {
                response.status = 401;
                response.body = "API key incorrect"
            }
        } catch(err){
            response = {
                status: 400,
                body: "Bad request"
            }
            console.log(err);
        }


        return response
    }

    async add(json:any){
        await _UtilsFunction.addUrlContent(json, json.type);
    }

    async remove(url:string){
        await _UtilsFunction.removeUrlContent(url);
    }
}