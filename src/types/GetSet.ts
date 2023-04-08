interface GetSet<T> {
  get: () => T;
  set: (obj: T) => void;
}

export class Obeserver<T> {
  private value: T;
  private functions: Record<string, (obj: T) => void> = {};
  public get() {
    return this.value;
  }
  public set(value: T) {
    this.value = value;
  }
  public addFunction(name: string, func: (obj: T) => void) {
    this.functions[name] = func;
  }
  constructor(value: T) {
    this.value = value;
  }
}
