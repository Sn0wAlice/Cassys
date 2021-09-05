export class MakeAResponse {
    async make(query, record){
        console.log(record)
        console.log(query)

        let target = ""
        let end = false

        // Check if IP is banned
        if(record.bannedIP.includes(query._client.hostname)){
            console.log(`[${query._client.hostname}] is banned of '${query.name}'`)
            target = record.bannedIpTarget
            end = true
        }

        // Check If Hacker Mode
        if(record.hackerMode && !end){
            console.log(`[${query._client.hostname}] pass by '${query.name}' MODE: [HACKING]`)
            target = record.HackerMode_targetDefalt
            end = true
        }

        // Chekc if IP restricted
        if(record.IsMultipleTargetIP && !end){
            console.log(`[${query._client.hostname}] pass by '${query.name}' MODE: [RESTRICT IP]`)
            target = record.IP_multipleTargetDefalt
            end = true
        }

        //Check country IP
        if(record.IsMultipleTargetCOUNTRY && !end){
            console.log(`[${query._client.hostname}] pass by '${query.name}' MODE: [COUNTRY]`)
            target = record.COUNTRY_multipleTargetDefalt
            end = true
        }

        console.log(`[${query._client.hostname}] response: ${target}`)
        return target
    }
}