export function main(balancerList){
    let sum = 0;
    for(let i = 0; i < balancerList.length; i++){
        sum += balancerList[i].proba;
    }
    return sum
}