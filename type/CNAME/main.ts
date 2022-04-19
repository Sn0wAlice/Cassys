import { CNAMERecord } from "../../dnsServ/mod.ts";

export async function main(query, record, utils){
    let target = record.target

    //Load Balancer
    try{
        if(record.balancer.length > 0){
            let sumProba = utils.countBalancerProba.main(record.balancer);
            let rand = Math.floor(Math.random() * sumProba);
            let balancerValue = utils.getViaProba.main(rand, record.balancer);
            target = balancerValue.target
        }
    } catch(err){}

    return [{record: new CNAMERecord(target) }]
}