import { UtilsFunction } from './funtion.ts';
const _UtilsFunction = new UtilsFunction();

let fileContent = JSON.parse(Deno.readTextFileSync('./explose.json'))


for(let i=0; i<fileContent.length; i++){
    await _UtilsFunction.addUrlContent(fileContent[i], fileContent[i].type);
}
