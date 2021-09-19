export class UtilsFunction{
    async genFileLocation(link:string){
        let urlArray = link.split('.');
        let filesUrl = "./config/gen"
        urlArray[1] = urlArray[0] + urlArray[1]
        for(let i=1; i<urlArray.length; i++){
            filesUrl = filesUrl + "/" + urlArray[i];
        }
        return filesUrl;
    }
}