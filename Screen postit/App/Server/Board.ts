
/// <reference path="Position.ts" />


class Board {
    public X: number;
    public Y: number;
    public x: number;
    public y: number; 

    constructor(X: number, Y: number) {
        this.X = X;
        this.Y = Y;
    }

    clamp(val: number, min: number, max: number): number {
       
        return Math.min(Math.max(val, min), max);
    }

    ClampMove(pos: position): position {
        this.x = 6;
        this.y = 5;
        pos.x = this.clamp(pos.x, 0, this.X - this.x);
        pos.y = this.clamp(pos.y, 0, this.Y - this.y);
        return pos;
    }
}