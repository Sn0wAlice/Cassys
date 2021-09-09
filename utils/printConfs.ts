export class PrintConfs {
    async printConfs(record) {
        for(let i=0; i<record.length; i++) {
            if(record[i].type == "A") {
                this.showAConf(record[i]);
            }
        }
    }

    async showAConf(record){
        console.log(`~ '${record.url}' A [BASE] - default on: ${record.target}`)
        console.log(`~ '${record.url}' A [BASE] - ${record.bannedIP.length} banned IP pointing on: ${record.bannedIpTarget}`)

        if(record.HackerMode){
            console.log(`~ '${record.url}' A [Hack] - is in HackerMode`)
        } else {
            let end = false
            if(record.IsMultipleTargetIP) {
                end = true
                console.log(`~ '${record.url}' A [IP-RESTRICT] - default on: ${record.IP_multipleTargetDefalt}`)
                for(let i=0; i<record.IP_multipleTarget.length; i++) {
                    if(record.IP_multipleTarget[i].solo){
                        console.log(`~ '${record.url}' A [IP-RESTRICT] - ${record.IP_multipleTarget[i].soloIp.length} ip on: ${record.IP_multipleTarget[i].soloTarget}`)
                    } else {
                        let startIP = record.IP_multipleTarget[i].startA+"."+record.IP_multipleTarget[i].startB+"."+record.IP_multipleTarget[i].startC+"."+record.IP_multipleTarget[i].startD;
                        let endIP = record.IP_multipleTarget[i].endA+"."+record.IP_multipleTarget[i].endB+"."+record.IP_multipleTarget[i].endC+"."+record.IP_multipleTarget[i].endD;
                        console.log(`~ '${record.url}' A [IP-RESTRICT] - range: ${startIP} / ${endIP} on: ${record.IP_multipleTarget[i].target}`)
                    }
                }
            }
    
            if(end && record.IsMultipleTargetCOUNTRY) {
                if(record.target === record.IP_multipleTargetDefalt){
                    end = false
                }
            }
    
            if(record.IsMultipleTargetCOUNTRY && !end) {
                end = true
                console.log(`~ '${record.url}' A [COUNTRY] - default on: ${record.COUNTRY_multipleTargetDefalt}`)
                for(let i=0; i<record.COUNTRY_multipleTarget.length; i++) {
                    console.log(`~ '${record.url}' A [COUNTRY] - ${record.COUNTRY_multipleTarget[i].country.length} Country on: ${record.COUNTRY_multipleTarget[i].target}`)
                }
            }
        }
    }
}