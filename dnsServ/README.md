# Dename

DNS Server framework for Deno. Port of [node-named](https://github.com/trevoro/node-named).

## Usage

```ts
import { DNSServer, CNAMERecord } from "https://deno.land/x/dename/mod.ts";

const server = new DNSServer({
  "domain": new CNAMERecord("points-to.this"),
});

server.on("listen", () => {
  console.log("Listening ~");
});

server.listen({ port: 6969 });
```

## Contributing

You're always welcome to contribute! We use `deno fmt` to format the code.

## License

Check [LICENSE](LICENSE) for more info.

Copyright 2021 @ DjDeveloperr