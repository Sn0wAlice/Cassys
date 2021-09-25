import { existsSync } from "https://deno.land/std/fs/mod.ts";

export class UtilsFunction{
    async Execute(commande: any) {
        let content = "";
        let comcmd = commande.split(' ')
        let p = Deno.run({cmd: comcmd,stdout: "piped"});
    
        let { code } = await p.status();
        if (code === 0) {
        let rawOutput = await p.output();
        content = new TextDecoder().decode(rawOutput);
        }
        return content
    }

    async genFileLocation(link:string){
        let urlArray = link.split('.');
        let filesUrl = "./config/gen"
        urlArray[urlArray.length-2] = urlArray[urlArray.length-2] + "." + urlArray[urlArray.length-1] 
        for(let i=urlArray.length-2; i>=0; i--){
            filesUrl = filesUrl + "/" + urlArray[i];
        }
        return filesUrl;
    }

    async addUrlContent(content, type) {
        let url = await this.genFileLocation(content.url)
        let arrayUrl = url.split('/');
        let tmp = "./config/gen/"
        for(let i=3; i<=arrayUrl.length; i++){
            if(!existsSync(tmp)){
                await this.Execute("mkdir " + tmp)
            }
            tmp = tmp + arrayUrl[i] + "/";
        }
        try{
            Deno.writeTextFileSync(url+"/"+type+".json", JSON.stringify(content))
            console.log(`[Cassys] - [DNS] - [ADD] - ${content.url} ${type} `)
        } catch(err){
            console.log(err)
        }
    }
    async removeUrlContent(url:String) {
        let urlArray = url.split('.');
        let filesUrl = "./config/gen"
        urlArray[urlArray.length-2] = urlArray[urlArray.length-2] + "." + urlArray[urlArray.length-1] 
        for(let i=urlArray.length-2; i>=0; i--){
            filesUrl = filesUrl + "/" + urlArray[i];
        }
        
        try{
            await this.Execute("rm -rf " + filesUrl)
            console.log(`[Cassys] - [DNS] - [REMOVE] - ${url} `)
        } catch(err){
            console.log(err)
        }
    }
}