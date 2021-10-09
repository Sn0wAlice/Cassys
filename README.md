# Cassys <img src="./img/blackcurrant.png" height="50">

<img src="./img/cassys2.gif">

*Working In early beta*

# Record

## Need to know

### A record
**HackerMode** > **Restrict By Ip** > **Restrict By Country**. So if a IP restriction affect response, Country restriction will be bypass. Same for HackerMode and Restric By Ip<br>
Banned IP Will bypass ALL the filter :) *Logic*

## Records

> All the multiple target Are in beta testing __ONLY__

All record exemple are in `./config/exemple.json` to copy past conf :) <br>
Please consider use the API to add a new host

## Database organisation
The file architecture is: `config/gen/${HOSTNAME}/${SUB1}/${SUB2}/${TYPE}.json`<br>
__Exemple__: 
- testing.cassys.cnil.me / CNAME
- `config/gen/cnil.me/cassys/testing/CNAME.json`

### Record exeption
In the code, `target` also contain the text reponse. For exemple target contain the TXT response!

# Record Support
- A `beta`
- AAAA `unstable`
- CNAME `beta`
- MX `beta`
- NS `beta`
- SOA `beta`
- SRV `beta`
- TXT `beta`

# Lauch the app
## Args

`deno run -A --unsable --no-check main.ts [ARGS]`

### Starting
- `--no-DNS`
     - Don't start the DNS server (Port 6969)
- `--no-WEB`
     - Don't start the WEB server (Port in config.json)
- `--no-API`
     - Don't start the API server (Port in config.json)

### DNS
- `--debug`
     - Activate the debug mode
- `--countryForce`
     - Force user to pass by country restriction


# API
You need to config the `api/conf.json` file. Use the exemple file to create it.

> Manage your database via the API is realy easy but ***CREATE A STRONG AUTH KEY***

| URL | action | exemple |
| :--- | :---- | :----- |
| /add | add a new host | api/exemple/add.js |
| /remove | remove a host | api/exemple/remove.js |

# Devil infos
<img src="./img/skull.gif"  height="250">

## Github Page Conf: 
```
EXAMPLE.COM     3600    IN A        185.199.108.153
EXAMPLE.COM     3600    IN AAAA     2606:50c0:8000::153
```

# TODO

- local network system