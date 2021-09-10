# Cassys <img src="./img/blackcurrant.png" height="50">

<img src="./img/open-source.gif">

- Working In early beta


# Record

## Need to know

### A record
**HackerMode** > **Restrict By Ip** > **Restrict By Country**. So if a IP restriction affect response, Country restriction will be bypass. Same for HackerMode and Restric By Ip<br>
Banned IP Will bypass ALL the filter :) *Logic*

## A record
```JSON
{
     "url": "exemple.com", //The URL *Required*
     "type": "A", //The type *Required*
     "target": "0.0.0.0", //Defalt target URL *Required*

     "bannedIP": [], //List of user banned ip. Format: String *Required*
     "bannedIpTarget": "6.0.0.0", // The banned IP user response *Required*

     "IsMultipleTargetIP": true, //If there are a IP change *Required*
     "IP_multipleTargetDefalt": "127.0.0.1", //the defalt IP
     "IP_multipleTarget": [ 
          //Target: A.B.C.D
          {
               "solo": false, //If false create the ip range like between
               "startA": 0,
               "startB": 0,
               "startC": 0,
               "startD": 0,
               "endA": 255,
               "endB": 255,
               "endC": 255,
               "endD": 255,
               "target": "127.0.0.1"      
          },
          {
               "solo": true, //If true; set the IP for this user
               "soloIp": ["1.2.3.4"], //The users ip spec
               "soloTarget": "127.1.0.0"
          }
     ],

     "IsMultipleTargetCOUNTRY": true, //If change IP / country: *Required*
     "COUNTRY_multipleTargetDefalt": "127.0.0.1", //Defalt ip for change IP
     "COUNTRY_multipleTarget": [
          {
               "country": ["France"], //Country Name
               "target": "127.0.0.3" //End IP
          }
     ],

     "HackerMode": true, // If Hacker Mode DNS *Required*
     "HackerMode_targetDefalt": "27.0.0.0", //defalt HACKER mode ip
     "DNS_rebinding": true, //Ennable DNS rebinding for this domain

     "TorUserRedirect": true, // If user use tor network
     "TorUserBanned": false, // Ban tor user
     "TorRedirectTarget": "6.6.6.6" // Target for the tor network user
}
```

All other record see `./config.json` to copy past conf :)

## TXT record
Same that A record. Target = Content

# Record
- A `beta`
- AAAA `no-work`
- CNAME `beta`
- MX `beta`
- NS `beta`
- SOA `beta`
- SRV `beta`
- TXT `beta`

## Args

- `--debug`
     - Activate the debug mode
- `--countryForce`
     - Force user to pass by country restriction

# TODO

- Detect IPV4 - IPV6 for ip restriction
- IP country caches

- DNS analyse to detect Other DNS serveur on the private network
