export class checkRequest {


    async checkBan(record, query){
        if(record.bannedIP.includes(query._client.hostname)){
            console.log(`[${query._client.hostname}] is banned of '${query.name}'`)
            return true
        } else {
            return false
        }
    }

    async checkTor(record, query) {
        if(query.ontor && query.TorUserRedirect && (query.TorRedirectTarget != undefined || query.TorRedirectHostname != undefined)){
            console.log(`[${query._client.hostname}] is TOR NetWork`)
            return true
        } else {
            return false
        }
    }

    async checkHackerMode(record, query){
        if(record.hackerMode){
            console.log(`[${query._client.hostname}] pass by '${query.name}' MODE: [HACKING]`)
            return true
        } else {
            return false
        }
    }

    async checkMultipleTargetIP(record, query){
        if(record.IsMultipleTargetIP || record.IsMultipleHostnameIP){
            console.log(`[${query._client.hostname}] pass by '${query.name}' MODE: [RESTRICT IP]`)
            return true
        } else {
            return false
        }
    }

    async checkCountry(record, query) {
        if(record.IsMultipleTargetCOUNTRY || record.IsMultipleHostnameCOUNTRY){
            console.log(`[${query._client.hostname}] pass by '${query.name}' MODE: [COUNTRY]`)
            return true
        } else {
            return false
        }
    }

}