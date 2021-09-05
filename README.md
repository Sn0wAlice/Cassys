# Cassys

```
     .ooooo.   .oooo.   .oooo.o  .oooo.o oooo    ooo  .oooo.o 
    d88'`"Y8 `P  )88b  d88(  "8 d88(  "8  `88.  .8'  d88(  "8 
    888        .oP"888  `"Y88b.  `"Y88b.    `88..8'   `"Y88b.  
    888   .o8 d8(  888  o.  )88b o.  )88b    `888'    o.  )88b 
    `Y8bod8P' `Y888""8o 8""888P' 8""888P'     .8'     8""888P' 
                                          .o..P'               
                                          `Y8P'
```

- Not Working yet, please WAIT

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
     "DNS_rebinding": true //Ennable DNS rebinding for this domain
}
```

# TODO

- DNS analyse to detect Other DNS serveur on the private network
