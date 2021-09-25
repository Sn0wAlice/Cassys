const http = require("http");

const options = {
  "method": "POST",
  "hostname": "127.0.0.1",
  "port": "6002",
  "path": "/remove",
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
  url: 'url.de.test.exemple.com'
}));
req.end();