export class Stack<T> {
  private items: T[] = [];
  constructor(elements?: T[]) {
    if (elements) {
      this.items = elements;
    }
  }
  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }
  peekSecond(): T | undefined {
    if (this.size() >= 2) return this.items[this.items.length - 2];
    return;
  }

  contains(item: T): boolean {
    return this.items.includes(item);
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  allItem(): T[] {
    return this.items;
  }

  clear(): void {
    this.items = [];
  }
}
