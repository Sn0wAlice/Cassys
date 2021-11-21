export function main(proba, balancer){
    let i = 0;
    let balancerIndex = 0;
    let balancerProba = 0;
    while(i < balancer.length){
        balancerProba += balancer[i].proba;
        if(proba < balancerProba){
            balancerIndex = i;
            break;
        }
        i++;
    }
    return balancer[balancerIndex];
}