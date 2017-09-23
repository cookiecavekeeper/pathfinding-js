
export type FieldType = 'S' | '.' | 'W' | 'E';
export class Field {
    private _type: FieldType;
    private _x: number;
    private _y: number;


    constructor(type: FieldType, x: number, y: number) {
        this._type = type;
        this._x = x;
        this._y = y;
    }


    get type(): FieldType {
        return this._type;
    }

    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }

    equals(other: Field): boolean {
        return this.x === other.x && this.y === other.y;
    }

    isWalkable(): boolean {
        return this.type !== 'W';
    }
}