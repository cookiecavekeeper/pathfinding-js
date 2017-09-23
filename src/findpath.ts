import * as readline from 'readline';
import {Field, FieldType} from './Field';

main();

async function main() {
    const {data} = await readInput();

    const map: PlayingField = mapFieldTypesToMap(data);
    //console.log(map.map(r => r.map(e => e.type)));

    const startField = getFirstFieldForFieldType('S', map);
    const endField = getFirstFieldForFieldType('E', map);

    let path = findPath(startField, endField, map);

    console.log(visualizePath(path, map));
    console.log(`Steps: ${path.length - 1}`);
}

type PlayingField = Field[][];

function isFieldType(field: string): field is FieldType {
    return ['S', '.', 'W', 'E'].some(k => k === field);
}

interface Input {
    rows: number;
    data: FieldType[][];
}

function readInput(): Promise<Input> {
    return new Promise(resolve => {
        let reader = readline.createInterface(process.stdin);
        let firstLine = true;

        let rows: number;

        let data: FieldType[][] = [];

        reader.on('line', (line: string) => {
            if (firstLine) {
                rows = +line;
                firstLine = false;
            } else {
                data.push(line.split('').filter(isFieldType));
            }
        });

        reader.on('close', () => {
            resolve({rows, data});
        });
    });
}

function mapFieldTypesToMap(data: FieldType[][]): PlayingField {
    return data.map((row, y) => row.map((fieldType, x) => new Field(fieldType, x, y)));
}

function getFieldAtCoords(x: number, y: number, map: PlayingField): Field {
    return map[y][x];
}

function getFirstFieldForFieldType(target: FieldType, map: PlayingField): Field {
    for (let x = 0; x < map.length; x++) {
        let row = map[x];
        for (let y = 0; y < row.length; y++) {
            let fieldAtCoords = getFieldAtCoords(x, y, map);
            if (fieldAtCoords.type === target) {
                return fieldAtCoords;
            }
        }
    }
    throw new Error('FieldType not found');
}

function getPossibleFields(currentField: Field, map: PlayingField): Field[] {
    let result = [];

    if (currentField.x - 1 >= 0 && getFieldAtCoords(currentField.x - 1, currentField.y, map).isWalkable()) {
        result.push(getFieldAtCoords(currentField.x - 1, currentField.y, map));
    }

    if (currentField.x + 1 < map.length && getFieldAtCoords(currentField.x + 1, currentField.y, map).isWalkable()) {
        result.push(getFieldAtCoords(currentField.x + 1, currentField.y, map));
    }

    if (currentField.y - 1 >= 0 && getFieldAtCoords(currentField.x, currentField.y - 1, map).isWalkable()) {
        result.push(getFieldAtCoords(currentField.x, currentField.y - 1, map));
    }

    if (currentField.y + 1 < map[0].length && getFieldAtCoords(currentField.x, currentField.y + 1, map).isWalkable()) {
        result.push(getFieldAtCoords(currentField.x, currentField.y + 1, map));
    }

    return result;
}

function findPath(startField: Field, endField: Field, map: PlayingField): Field[] {
    let queue: Field[] = [];
    let visited = new Set<Field>();
    let nodeParents = new Map<Field, Field>();

    queue.push(startField);

    while (queue.length !== 0) {
        let currentField = queue.pop();

        if (currentField.equals(endField)) {
            console.log('The end!!!');

            let path = [];
            let tracebackField = endField;
            path.push(endField);

            while (tracebackField !== startField) {
                tracebackField = nodeParents.get(tracebackField);
                path.push(tracebackField);
            }

            path = path.reverse();

            return path; // we did it reddit
        }

        let possibleFields = getPossibleFields(currentField, map);

        for (let field of possibleFields) {
            if (visited.has(field)) {
                continue;
            }
            visited.add(field);
            nodeParents.set(field, currentField);

            queue.push(field);
        }
    }

    throw new Error('No Path found!!');
}

function visualizePath(path: Field[], map: PlayingField) {
    return map
        .map(row =>
            row
                .map(field => {
                    if (field.type === '.' && path.includes(field)) {
                        return '#';
                    } else {
                        return field.type;
                    }
                })
                .join('')
        )
        .join('\n');
}
