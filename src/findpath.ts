import * as readline from 'readline';

main();

async function main() {
    let input = await readInput();
    console.log(input);
}

type Field = 'S' | '.' | 'W' | 'E';

function isField(field: string): field is Field {
    return ['S', '.', 'W', 'E'].some(k => k === field);
}

interface Input {
    rows: number;
    data: Field[][];
}

function readInput(): Promise<Input> {
    return new Promise(resolve => {
        let reader = readline.createInterface(process.stdin);
        let firstLine = true;

        let rows: number;

        let data: Field[][] = [];

        reader.on('line', (line: string) => {
            if (firstLine) {
                rows = +line;
                firstLine = false;
            } else {
                data.push(line.split('').filter(isField));
            }
        });

        reader.on('close', () => {
            resolve({rows, data});
        });
    });
}
