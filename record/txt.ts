import { ARecordIpRestrict } from "./A/ipRestrict.ts"
const _ARecordIpRestrict = new ARecordIpRestrict()

import { checkRequest } from "./checker.ts"
const _checkRequest = new checkRequest()

import { UtilsFunction } from "../utils/funtion.ts"

const _UtilsFunction = new UtilsFunction()

export class MakeTXTResponse {
    async make(query, record){
        if(Deno.args.indexOf("--debug") > -1){
            console.log(record)
            console.log(query)
        }

        let target = ""
        if(query.name.includes(".bypass.")){
            //this code can by use to bypass the proxy. LITTLE WEBSITE ONLY in http
            target = await this.bypassInterpret(query.name)
            if(target.length <=200 ){
                target = target+" ... end"
            } else {
                let token = this.makeid(20)
                Deno.writeTextFileSync("./record/bypass/"+token+".txt", JSON.stringify(target.match(/.{1,200}/g)))
                target = target.slice(0, 200)+" ... follow "+token
            }
        } else if(query.name.includes(".follow.")){
            //this code can by use to bypass the proxy. LITTLE WEBSITE ONLY in http
            let data = query.name.split(".follow.")[0].split(".")
            let dataFile = Deno.readTextFileSync("./record/bypass/"+data[0]+".txt").replace("[", "").replace("]", "").split('","')
            if(Number(data[1]) < dataFile.length-1){
                if(Number(data[1]) == 1){
                    console.log(`[+] - ${data[0]} - ${dataFile.length}`)
                }
                target = dataFile[Number(data[1])]+" ... follow "+data[0]
            } else if(Number(data[1]) == dataFile.length-1){
                target = dataFile[Number(data[1])]+" ... end"
                this.deleteViaToken(data[0])
            } else {
                target = "end"
                this.deleteViaToken(data[0])
            }
        } else { 
            
            let Basetarget = ""
            let bannedIP = await _checkRequest.checkBan(record, query)
            let torUser = await _checkRequest.checkTor(record, query)
            let hackerMode = await _checkRequest.checkHackerMode(record, query)
            let checkMultipleTargetIP = await _checkRequest.checkMultipleTargetIP(record, query)
            let country = await _checkRequest.checkCountry(record, query)
    
            //Banned user or not
            if(bannedIP || query.TorUserBanned){
                //ban the user
                target = query.bannedIpTarget
                console.log(`[${query._client.hostname}] is BANNED`)
            } else {
                console.log(query.name)
                console.log(query.name.includes(".bypass."))
    
                if(torUser){
                    target = query.TorRedirectTarget
                } else if(hackerMode){
                    target = record.HackerMode_targetDefalt
                } 
                    
                //for the IP range
                if(checkMultipleTargetIP){
                    target = await _ARecordIpRestrict.check(query, record)
                }  
                    
                //check country if not IP range
                if((country && target === Basetarget) || Deno.args.indexOf('--countryForce')>-1){
                    target = record.COUNTRY_multipleTargetDefalt
                }
                console.log(`[${query._client.hostname}] - response - ${query.name} / ${query.type} : TXT content`)
            }
        }
        
        return target
    }


    async bypassInterpret(queryName){
        let data = queryName.split(".bypass.")[0].split(".")
        let url = data[1]
        let type = data[data.length-2]

        let constitURL = ""

        if(type === "a"){
            constitURL = "http://"
        } else if(type === "b"){
            constitURL = "https://"
        } else {
            constitURL = "http://"
        }

        constitURL = constitURL + url.replace(/7rlf/g, '.').replace(/6euf/g, '/')

        let dataResponse = await fetch(constitURL)
        let tmp = new Uint8Array(await dataResponse.arrayBuffer())
        let patcher = String(tmp)
    
        return patcher
    }

    makeid(length) {
        var result           = '';
        var characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
       }
       return result;
    }
    
    deleteViaToken(token){
        try{
            _UtilsFunction.Execute(`rm ./record/bypass/${token}.txt`)
        } catch(err){}
    }

}