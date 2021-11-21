import { SRVRecord } from "../../dnsServ/mod.ts";

export async function main(query, record, utils){
    let target = {
        host: record.target,
        port: record.ttl 
    }

    //Load Balancer
    if(record.balancer.length > 0){
        let sumProba = utils.countBalancerProba.main(record.balancer);
        let rand = Math.floor(Math.random() * sumProba);
        let balancerValue = utils.getViaProba.main(rand, record.balancer);
        target = {
            host: balancerValue.target,
            port: balancerValue.port 
        }
    }

    return [{record: new SRVRecord({host: target.host ,port: target.port})}]
}