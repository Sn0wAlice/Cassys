export function main(domain, type, content){
    let domainSplit = domain.split(".")
    let link = "./db/"
    for(let i=domainSplit.length-1; i>=0; i--){
        link += domainSplit[i]+"/"
    }
    try{
        Deno.writeTextFileSync(link+type+".json", content)
    } catch(err){}
}