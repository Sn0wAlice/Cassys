export class ARecordIpRestrict {
    async check(query, record){
        let target = record.IP_multipleTargetDefalt;

        for(let i = 0; i < record.IP_multipleTarget.length; i++){
            //All the solo ip
            if(record.IP_multipleTarget[i].solo){
                if(record.IP_multipleTarget[i].soloIp.indexOf(query._client.hostname)>-1){
                    target = record.IP_multipleTarget[i].soloTarget;
                    break;
                }
            } else {
                //Calculate the ip range
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
            }
        }

        return target
    }

    async checkAllSoloIp(record){
        
    }
}