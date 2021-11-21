# Cassys

<img src="./img/cassys.gif">

*Working In early beta* ^_-

# Record

## Infos
> All the multiple target Are in beta testing __ONLY__

All record exemple are in `./type/${TYPE_NAME}/exemple.json` to copy past conf :) <br>

## Database organisation
The file architecture is: `./db/${DOMAIN}/${HOSTNAME}/${SUB1}/${SUB2}/${TYPE}.json`<br>
__Exemple__: 
- testing.cassys.cnil.me / CNAME
- `./db/me/cnil/cassys/testing/CNAME.json`

# Record Support
- A `beta`
- AAAA `unstable` 0.o
- CNAME `beta`
- MX `beta`
- NS `beta`
- SOA `beta`
- SRV `beta`
- TXT `beta`

# Lauch the app

`deno run -A --unsable --no-check dns.ts`

# Network Special layers

## - DNS tunneling

- The client is in `./clients/tunneling/main.ts`<br>
- Configure the client <br>
- Connect your proxy of firefox on it:<br>
<img src="./img/dns_tun.png"><br>

> And tada, it's working ! 0.o

## - Chat
- The client is in `./clients/chat/main.js`<br>
- Install deps with `npm i`<br>
- Configure the client <br>
- `node client.js`<br>
<img src="./img/dns_chat.png"><br>

> Beta project. But working. Please wait for update ^.-

# Copy Past Zone

## Github Page Conf: 
```
EXAMPLE.COM     3600    IN A        185.199.108.153
EXAMPLE.COM     3600    IN AAAA     2606:50c0:8000::153
```
