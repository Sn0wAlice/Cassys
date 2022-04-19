import { NSRecord } from "../../dnsServ/mod.ts";

export async function main(query, record, utils){
    let target = record.target

    try{
        //Load Balancer
        if(record.balancer.length > 0){
            let sumProba = utils.countBalancerProba.main(record.balancer);
            let rand = Math.floor(Math.random() * sumProba);
            let balancerValue = utils.getViaProba.main(rand, record.balancer);
            target = balancerValue.target
        }
    } catch(err){}
    

    return [{record: new NSRecord({target: target, ttl: 3600}) }]
}