import * as readline from 'readline';



let reader = readline.createInterface(process.stdin);

reader.on('line', line => {
    console.log(line);
});
