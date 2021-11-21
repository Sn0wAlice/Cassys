export function main(domain, type){
    let domainSplit = domain.split(".")
    let link = "./db/"
    for(let i=domainSplit.length-1; i>=0; i--){
        link += domainSplit[i]+"/"
    }
    try{
        return JSON.parse(Deno.readTextFileSync(link+type+".json"))
    } catch(err){}
    return 'e'
}