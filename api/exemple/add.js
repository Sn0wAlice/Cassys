/*
Consider use the /add command to inject the data into the database.
*/

const http = require("http");

const options = {
  "method": "POST",
  "hostname": "URL_SERVER",
  "port": "6002",
  "path": "/add",
  "headers": {
    "content-type": "application/json"
  }
};

const req = http.request(options, function (res) {
  const chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    const body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});

req.write(JSON.stringify({
  token: 'IOvHVYuiougVUgioguVU8GivuYIGuvFUGivUCTFIGUVCrx-cf',
  JSONcontent: {
    url: 'testing.cassys.cnil.me',
    type: 'AAAA',
    target: '2606:50c0:8000::153',
    bannedIP: [],
    bannedIpTarget: '6.0.0.0',
    IsMultipleTargetIP: false,
    IP_multipleTargetDefalt: '17.0.0.1',
    IP_multipleTarget: [
      {
        solo: false,
        startA: 0,
        startB: 0,
        startC: 0,
        startD: 0,
        endA: 155,
        endB: 255,
        endC: 255,
        endD: 255,
        target: '17.0.1.0'
      },
      {solo: true, soloIp: ['1.2.3.4'], soloTarget: '17.0.1.1'}
    ],
    IsMultipleTargetCOUNTRY: false,
    COUNTRY_multipleTargetDefalt: '17.0.0.1',
    COUNTRY_multipleTarget: [{country: ['france'], target: '17.0.3.1'}],
    HackerMode: false,
    HackerMode_targetDefalt: '27.0.0.0',
    DNS_rebinding: false,
    TorUserRedirect: false,
    TorUserBanned: false,
    TorRedirectTarget: '6.6.6.6'
  }
}));
req.end();