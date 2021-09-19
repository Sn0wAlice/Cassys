import { UtilsFunction } from '../utils/funtion.ts';
const _UtilsFunction = new UtilsFunction();

let json = {
    "url": "testing.cassys.cnil.me",
    "type": "CNAME",
    "target": "cnil-me.github.io",

    "bannedIP": [],
    "bannedIpTarget": "cnil-me.github.io",

    "IsMultipleTargetIP": false,
    "IP_multipleTargetDefalt": "cname.exemple3.com",
    "IP_multipleTarget": [{
            "solo": false,
            "startA": 0,
            "startB": 0,
            "startC": 0,
            "startD": 0,
            "endA": 155,
            "endB": 255,
            "endC": 255,
            "endD": 255,
            "target": "cname.exemple4.com"
        },
        {
            "solo": true,
            "soloIp": ["1.2.3.4"],
            "soloTarget": "cname.exemple4.com"
        }
    ],

    "IsMultipleTargetCOUNTRY": false,
    "COUNTRY_multipleTargetDefalt": "cname.exemple5.com",
    "COUNTRY_multipleTarget": [{
        "country": ["france"],
        "target": "cname.exemple6.com"
    }],

    "HackerMode": false,
    "HackerMode_targetDefalt": "cname.exemple7.com",
    "DNS_rebinding": true,

    "TorUserRedirect": false,
    "TorUserBanned": false,
    "TorRedirectTarget": "cname.exemple8.com"
}

await _UtilsFunction.addUrlContent(json, json.type);
console.log(`Host ${json.url} added`)