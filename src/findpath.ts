import * as readline from 'readline';

main();

async function main() {
    let input = await readInput();
    console.log(input);
}

interface Input {
    rows: number
    data: string[][]
}

function readInput(): Promise<Input> {
    return new Promise((resolve) => {
        let reader = readline.createInterface(process.stdin);
        let firstLine = true;

        let rows: number;

        let data: string[][] = [];

        reader.on('line', (line: string) => {
            if (firstLine) {
                rows = +line;
                firstLine = false;
            } else {
                data.push(line.split(''));
            }
        });

        reader.on('close', () => {
            resolve({rows, data});
        });
    });
}
