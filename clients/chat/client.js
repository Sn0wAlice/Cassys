const { createInterface, clearLine, moveCursor } = require("readline"),
    { createConnection } = require("net");
const { exec } = require("child_process");

const interface = createInterface(process.stdin, process.stdout)

function init() {
    process.stdout.write("\x1Bc");
    console.log(Array(process.stdout.rows + 1).join("\n"));
}

function output(content) {
    clearLine(process.stdout);
    console.log("\r"+content);
    interface.prompt(true);
}

function input(question = "> ") {
    return new Promise(resolve => {
        interface.question(question, answer => {
            moveCursor(process.stdout, 0, -1);
            clearLine(process.stdout);
            resolve(answer);
        });
    })
}

async function *inputs() {
    while (true) {
        yield await input();
    }
}


async function main() {
    init();
    for await (const input of inputs()) {
        if(input === "clear"){
            init();
        } else {
            sendMessage(input);
        }
    }
}

//configure me
const hostname = "@127.0.0.1 -p 6969"

function sendMessage(message){
    message = message.replace(/ /g, "o.o");
    let tmp = message+"_"+"test"+"_"+"new";
    exec(`dig ${hostname} ${tmp}njbhj.morpheus.cnil.me +short TXT`, (error, stdout, stderr) => { });
}


function checkForUpdates(date) {
    let tmp = date+"_"+"test"+"_"+"check";
    exec(`dig ${hostname} ${tmp}njbhj.morpheus.cnil.me +short TXT`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        stdout = stdout.split('\n')[1].replace(/"/g, "")
        if(stdout != "no"){
            let data = stdout.split(" ._. ");
            output("msg: "+data[0].replace(/o.o/g, " "));
            if(data[2] == "y"){
                getnext(data[1]);
            }
        }
    });
}

function getnext(token){
    let tmp = token+"_"+"test"+"_"+"getnext";
    exec(`dig ${hostname} ${tmp}njbhj.morpheus.cnil.me +short TXT`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        stdout = stdout.split('\n')[1].replace(/"/g, "")
        if(stdout != "no"){
            let data = stdout.split(" ._. ");
            output("msg: "+data[0].replace(/o.o/g, " "));
            if(data[2] == "y"){
                getnext(data[1]);
            }
        }
    });
}

setInterval(() => {
    checkForUpdates(Date.now()-1000)
}, 1000);

main();