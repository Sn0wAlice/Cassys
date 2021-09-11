export class ARecordIpRestrict {
    async check(query, record){
        let target = record.IP_multipleTargetDefalt;

        if(record.IP_multipleHostname != undefined){
            record.IP_multipleTarget = record.IP_multipleHostname
        }

        for(let i = 0; i < record.IP_multipleTarget.length; i++){
            //All the solo ip
            if(record.IP_multipleTarget[i].solo){
                if(record.IP_multipleTarget[i].soloIp.indexOf(query._client.hostname)>-1){
                    target = record.IP_multipleTarget[i].soloTarget;
                    break;
                }
            } else {
                //Calculate the ip range

                //IPV4

                if(this.isIpv4(query._client.hostname)){
                    let RANGE = query._client.hostname.split('.');
                    for(let j = 0; j < RANGE.length; j++){ RANGE[j] = parseInt(RANGE[j]); }
                    
                    //Check the ip range
                    if(RANGE[0] > record.IP_multipleTarget[i].startA){
                        if(RANGE[0] < record.IP_multipleTarget[i].endA){
                            target = record.IP_multipleTarget[i].target;
                            if(RANGE[1] > record.IP_multipleTarget[i].startB){
                                if(RANGE[1] < record.IP_multipleTarget[i].endB){
                                    if(RANGE[2] > record.IP_multipleTarget[i].startC){
                                        if(RANGE[2] < record.IP_multipleTarget[i].endC){
                                            if(RANGE[3] > record.IP_multipleTarget[i].startD){
                                                if(RANGE[3] < record.IP_multipleTarget[i].endD){
                                                    target = record.IP_multipleTarget[i].target;
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                            } 
                        }
                    } 
                } else {
                    //to do the IPV6 range restrinction
                }

            }
        }

        return target
    }


    isIpv4(ip){
        return /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip);
    }

    isIpv6(ip){
        return /((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))/.test(ip)
    }


}