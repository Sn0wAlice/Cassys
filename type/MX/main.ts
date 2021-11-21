import { MXRecord } from "../../dnsServ/mod.ts";

export async function main(query, record, utils){
    let target = {
        exchange: record.target,
        ttl: record.ttl 
    }

    //Load Balancer
    if(record.balancer.length > 0){
        let sumProba = utils.countBalancerProba.main(record.balancer);
        let rand = Math.floor(Math.random() * sumProba);
        let balancerValue = utils.getViaProba.main(rand, record.balancer);
        target = {
            exchange: balancerValue.target,
            ttl: balancerValue.ttl 
        }
    }

    return [{record: new MXRecord({exchange: target.exchange,ttl: target.ttl}) }]
}