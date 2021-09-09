export class TorNodes {
    async dlTorNodes(){
        //testing if can

        try{
            let data = await fetch(`https://cnil.me/getTorNodes/`, {method: 'GET'});
            let ips = await data.text();
            Deno.writeTextFileSync(`./utils/torNodes.txt`, ips)
        } catch(err){
            try{
                console.log(`[ERROR] - Load Tor nodes from caches`)
                Deno.readTextFileSync(`./utils/torNodes.txt`,)
            } catch(err){
                console.log(`[ERROR] - `)
                Deno.writeTextFileSync(`./utils/torNodes.txt`,"")
            }
        }
    }
}