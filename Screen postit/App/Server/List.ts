class List<T>
{
    public array: T[] = [];
    public changeEvent: () => void;

    count(): number {
        return this.array.length;
    }

    indexOf(item: T): number {
        return this.array.indexOf(item);
    }

    atIndex(index: number): T {
        return this.array[index];
    }

    insert(item: T, at: number): void {
        this.array.splice(at, 0, item);
        if (!!this.changeEvent) this.changeEvent();
    }

    add(item: T): void {
        this.array.push(item);
        if (!!this.changeEvent) this.changeEvent();
    }

    contains(item: T) {
        return this.array.indexOf(item) > -1;
    }

    clear() {
        this.array = [];
        if (!!this.changeEvent) this.changeEvent();
    }

    remove(item: T): boolean {
        var index = this.array.indexOf(item);
        if (index > -1) {
            this.array.splice(index, 1);
            if (!!this.changeEvent) this.changeEvent();
        }
        return index > -1;
    }
}