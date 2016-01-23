class position {
    public x: number;
    public y: number;

    constructor() {
        this.x = 0;
        this.y = 0;
    }

    add(pos: position) {
        this.x += pos.x;
        this.y += pos.y;
    }
}
