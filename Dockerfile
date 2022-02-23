FROM denoland/deno:latest as cassys

MAINTAINER alice

#Build the dir & move files
WORKDIR /app
ADD . ./

# Run the app
RUN deno install -A -f --unstable --no-check https://deno.land/x/denon/denon.ts
CMD ["denon", "run", "-A", "--unstable", "--no-check", "main.ts"]