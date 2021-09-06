export class TorNodes {
    async dlTorNodes(){
        let data = await fetch(`https://cnil.me/getTorNodes/`, {method: 'GET'});
        let ips = await data.text();
        Deno.writeTextFileSync(`./utils/torNodes.txt`, ips)
    }
}