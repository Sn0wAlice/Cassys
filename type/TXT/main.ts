import { TXTRecord } from "../../dnsServ/mod.ts";

export async function main(query, record, utils){
    let target = record.value

    ///// DNS Tunneling
    if(query.name.includes(".tb.")){
        //faire la requette 
        target = await bypassInterpret(query.name)
        if(target.length <=200 ){
            target = target+" ... end"
        } else {
            let token = makeid(20)
            let max = target.match(/.{1,200}/g).length
            token = token+"xxxt"+max
            Deno.writeTextFileSync("./tmp/bypass/"+token+".txt", JSON.stringify(target.match(/.{1,200}/g)))
            target = target.slice(0, 200)+" ... follow "+token
        }
    } else if(query.name.includes(".tf.")){
        //faire la reponse
        let data = query.name.split(".tf.")[0].split(".")
        let dataFile = Deno.readTextFileSync("./tmp/bypass/"+data[0]+".txt").replace("[", "").replace("]", "").split('","')
        if(Number(data[1]) < dataFile.length-1){
            if(Number(data[1]) == 1){
                console.log(`[+] - ${data[0]} - ${dataFile.length}`)
            }
            target = dataFile[Number(data[1])]+" ... follow "+data[0]
        } else if(Number(data[1]) == dataFile.length-1){
            target = dataFile[Number(data[1])]+" ... end"
        } else {
            target = "end"
        }
    } else if(query.name.includes('njbhj.morpheus.')){
        let data = query.name.split('njbhj.morpheus.')[0].split('_')[0]
        let chatroom = query.name.split('njbhj.morpheus.')[0].split('_')[1]
        let comm = query.name.split('njbhj.morpheus.')[0].split('_')[2]

        //get all msg from chatroom
        let message = "no"
        try{
            let messageFromChatroom = []
            try{
                messageFromChatroom = JSON.parse(Deno.readTextFileSync("./tmp/chat/"+chatroom+".json"))
            } catch(err){}
            
            if(comm == "check"){
                let time = Number(data)
                //check message after time
                for(let i=0; i<messageFromChatroom.length; i++){
                    if(messageFromChatroom[i].time > time){
                        let checknext = "y"
                        if(i == messageFromChatroom.length-1){
                            checknext = "n"
                        }
                        message = messageFromChatroom[i].message+" ._. "+messageFromChatroom[i].token+" ._. "+checknext
                        break
                    }
                }
            } else if(comm == "getnext"){
                let index = messageFromChatroom.findIndex(x => x.token == data)
                if(index != -1){
                    let checknext = "y"
                    if(index == messageFromChatroom.length-1){
                        checknext = "n"
                    }
                    message = messageFromChatroom[index].message+" ._. "+messageFromChatroom[index].token+" ._. "+checknext
                } else {
                    message = "no"
                }
            } else if(comm == "new"){
                console.log(`[+] - ${chatroom} - ${data}`)
                let newmessage = {
                    message: data,
                    time: Date.now(),
                    token: makeid(20)
                }
                messageFromChatroom.push(newmessage)
                console.log(messageFromChatroom)
                Deno.writeTextFileSync("./tmp/chat/"+chatroom+".json", JSON.stringify(messageFromChatroom))
            }
            

        } catch(err){
            console.log(err)
        }
        target = message
    }

    ////// FAIRE LE SYSTEM DE DEL VIA DATE

    return [{record: new TXTRecord(target)}]
}


async function bypassInterpret(queryName){
    let data = queryName.split(".tb.")[0].split(".")
    let url = data[1]
    let type = data[data.length-2]

    let constitURL = ""

    if(type === "a"){
        constitURL = "http://"
    } else if(type === "b"){
        constitURL = "https://"
    } else {
        constitURL = "http://"
    }

    constitURL = constitURL + url.replace(/7rlf/g, '.').replace(/6euf/g, '/')

    console.log(constitURL)

    let dataResponse = await fetch(constitURL)
    let tmp = new Uint8Array(await dataResponse.arrayBuffer())
    let patcher = String(tmp)

    return patcher
}


function makeid(length) {
    var result           = '';
    var characters       = 'abcdefghijklmnopqrstuvwyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}
