import { ARecordIpRestrict } from "./A/ipRestrict.ts"
const _ARecordIpRestrict = new ARecordIpRestrict()

import { checkRequest } from "./checker.ts"
const _checkRequest = new checkRequest()

export class MakeMXResponse {
    async make(query, record){

        //Warning: target => hostname

        if(Deno.args.indexOf("--debug") > -1){
            console.log(record)
            console.log(query)
        }
        
        let target = {host: record.hostname, ttl: record.ttl}
        let Basetarget = record.target

        let bannedIP = await _checkRequest.checkBan(record, query)
        let torUser = await _checkRequest.checkTor(record, query)
        let hackerMode = await _checkRequest.checkHackerMode(record, query)
        let checkMultipleHostnameIP = await _checkRequest.checkMultipleTargetIP(record, query)
        let country = await _checkRequest.checkCountry(record, query)

        //Banned user or not
        if(bannedIP || query.TorUserBanned){
            //ban the user
            target.host = query.bannedIpHostname
            console.log(`[${query._client.hostname}] is BANNED`)
        } else {
            
            if(torUser){
                target.host = query.TorRedirectHostname
            } else if(hackerMode){
                target.host = record.HackerMode_hostnameDefalt
            } 
            
            //for the IP range
            if(checkMultipleHostnameIP){
                target.host = await _ARecordIpRestrict.check(query, record)
            }  
            
            //check country if not IP range
            if((country && target === Basetarget) || Deno.args.indexOf('--countryForce')>-1){
                target.host = record.COUNTRY_multipleHostnameDefalt
            }

            console.log(`[${query._client.hostname}] response: ${target.host} ${target.ttl}`)
        }
        
        return target
    }
}