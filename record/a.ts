import { ARecordIpRestrict } from "./A/ipRestrict.ts"
const _ARecordIpRestrict = new ARecordIpRestrict()

import { checkRequest } from "./checker.ts"
const _checkRequest = new checkRequest()

import { CountryRestriction } from "./utils/countryRestrict.ts"
const _countryRestriction = new CountryRestriction()

export class MakeAResponse {
    async make(query, record){

        if(Deno.args.indexOf("--debug") > -1){
            console.log(record)
            console.log(query)
        }
        
        let target = record.target
        let Basetarget = record.target

        let bannedIP = await _checkRequest.checkBan(record, query)
        let torUser = await _checkRequest.checkTor(record, query)
        let hackerMode = await _checkRequest.checkHackerMode(record, query)
        let checkMultipleTargetIP = await _checkRequest.checkMultipleTargetIP(record, query)
        let country = await _checkRequest.checkCountry(record, query)

        if(Deno.args.indexOf("--debug") > -1){
            console.log(bannedIP)
            console.log(torUser)
            console.log(hackerMode)
            console.log(checkMultipleTargetIP)
            console.log(country)
        }

        //Banned user or not
        if(bannedIP || query.TorUserBanned){
            //ban the user
            target = query.bannedIpTarget
            console.log(`[${query._client.hostname}] is BANNED`)
        } else {
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
                let countryIp = await _countryRestriction.getCountry(query._client.hostname)
                try{
                    if(country.geoplugin_countryName.toLowerCase() != "unknown"){
                        for(let i=0; i<record.COUNTRY_multipleTarget.length; i++){
                            if(record.COUNTRY_multipleTarget[i].country.indexOf(countryIp.geoplugin_countryName.toLowerCase())>-1){
                                target = record.COUNTRY_multipleTarget[i].target
                                break
                            }
                        }
                    }
                } catch(e){}
            }
            console.log(`[${query._client.hostname}] response: ${target}`)
        }
        
        return target
    }
}