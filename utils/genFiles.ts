export function main(domain){
    let domainSplit = domain.split(".")
    let link = "./db/"
    for(let i=domainSplit.length-1; i>=0; i--){
        link += domainSplit[i]+"/"
        createFolder(link)
    }
}


function createFolder(folder){
    if(!Deno.statSync(folder).isDirectory){
        Deno.mkdirSync(folder)
    }
}