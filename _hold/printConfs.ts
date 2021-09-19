export class PrintConfs {
    async printConfs(record) {
        //Print general confs
        await this.showArgsConfg()
        //Print User conf
        for(let i=0; i<record.length; i++) {
            if(["A", "CNAME", "NS", "SOA", "TXT"].indexOf(record[i].type)>-1) {
                this.showConf(record[i], record[i].type);
            } else if(record[i].type === "MX") {
                this.showConf(record[i], record[i].type, record[i].ttl);
            } else if(record[i].type === "SRV") {
                this.showConf(record[i], record[i].type, record[i].port);
            } 
        }
    }

    async showArgsConfg(){
        if(Deno.args.indexOf("--debug") > -1){
            console.log("~ [ARGS] - '--debug' - debug mode on")
        }
        if(Deno.args.indexOf("--countryForce")>-1) {
            console.log("~ [ARGS] - '--countryForce' - force country mode")
        }
    }

    async showConf(record, type, other?){
        console.log(`~ '${record.url}' ${type} [BASE] - default on: ${record.target}`)
        console.log(`~ '${record.url}' ${type} [BASE] - ${record.bannedIP.length} banned IP pointing on: ${record.bannedIpTarget}`)

        if(other){
            if(type === "MX"){
                console.log(`~ '${record.url}' ${type} [BASE] - TTL: ${other}`)
            } else if(type === "SRV"){
                console.log(`~ '${record.url}' ${type} [BASE] - PORT: ${other}`)
            }
        }

        if(record.HackerMode){
            console.log(`~ '${record.url}' ${type} [Hack] - is in HackerMode`)
        } else {
            let end = false
            if(record.IsMultipleTargetIP) {
                end = true
                console.log(`~ '${record.url}' ${type} [IP-RESTRICT] - default on: ${record.IP_multipleTargetDefalt}`)
                for(let i=0; i<record.IP_multipleTarget.length; i++) {
                    if(record.IP_multipleTarget[i].solo){
                        console.log(`~ '${record.url}' ${type} [IP-RESTRICT] - ${record.IP_multipleTarget[i].soloIp.length} ip on: ${record.IP_multipleTarget[i].soloTarget}`)
                    } else {
                        let startIP = record.IP_multipleTarget[i].startA+"."+record.IP_multipleTarget[i].startB+"."+record.IP_multipleTarget[i].startC+"."+record.IP_multipleTarget[i].startD;
                        let endIP = record.IP_multipleTarget[i].endA+"."+record.IP_multipleTarget[i].endB+"."+record.IP_multipleTarget[i].endC+"."+record.IP_multipleTarget[i].endD;
                        console.log(`~ '${record.url}' ${type} [IP-RESTRICT] - range: ${startIP} / ${endIP} on: ${record.IP_multipleTarget[i].target}`)
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
                console.log(`~ '${record.url}' ${type} [COUNTRY] - default on: ${record.COUNTRY_multipleTargetDefalt}`)
                for(let i=0; i<record.COUNTRY_multipleTarget.length; i++) {
                    console.log(`~ '${record.url}' ${type} [COUNTRY] - ${record.COUNTRY_multipleTarget[i].country.length} Country on: ${record.COUNTRY_multipleTarget[i].target}`)
                }
            }
        }
    }
}