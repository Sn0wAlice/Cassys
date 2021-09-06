import { ARecordIpRestrict } from "./A/ipRestrict.ts"

const _ARecordIpRestrict = new ARecordIpRestrict()

export class MakeAResponse {
    async make(query, record){
        console.log(record)
        console.log(query)

        let target = record.target
        let Basetarget = record.target
        let end = false
        let block = false

        // Check if IP is banned
        if(record.bannedIP.includes(query._client.hostname)){
            console.log(`[${query._client.hostname}] is banned of '${query.name}'`)
            target = record.bannedIpTarget
            end = block = true
        }

        // Check if IP is Tode node
        if(query.ontor && query.TorUserRedirect && query.TorRedirectTarget != undefined){
            console.log(`[${query._client.hostname}] is TOR NetWork`)
            target = query.TorRedirectTarget
            end = block = true
        }

        // Check If Hacker Mode
        if(record.hackerMode && !end && !block){
            console.log(`[${query._client.hostname}] pass by '${query.name}' MODE: [HACKING]`)
            target = record.HackerMode_targetDefalt
            end = block = true
        }

        // Chekc if IP restricted
        if(record.IsMultipleTargetIP && !end && !block){
            console.log(`[${query._client.hostname}] pass by '${query.name}' MODE: [RESTRICT IP]`)
            target = await _ARecordIpRestrict.check(query, record)
            end = true
        }

        if(!block){
            if(target != Basetarget){
                block = true
            }
        }
        //Check country IP
        if(record.IsMultipleTargetCOUNTRY && ((!end || record.target === record.IP_multipleTargetDefalt) && !block)){
            console.log(`[${query._client.hostname}] pass by '${query.name}' MODE: [COUNTRY]`)
            target = record.COUNTRY_multipleTargetDefalt
            end = true
        }

        console.log(`[${query._client.hostname}] response: ${target}`)
        return target
    }
}