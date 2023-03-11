/**
 * This module doesn't get .d.ts files generated for it, so we have to do that
 * ourselves. 😢
 *
 * @internal
 */
declare module "@iter-tools/regex/internal/engine" {
  declare class Node {
    worse?: Node;
    data: any;
    constructor(data?: any);
  }

  declare class Sequence {
    next: any;
    mutableState: any;
    constructor(next: any, mutableState: any);
  }

  declare class Match {
    pattern: any;
    globalIdx: number;
    head: Node;
    captures?: any;
    constructor(pattern: any, globalIdx: number, captures?: any);
  }

  declare class Engine {
    index: number;
    starved: boolean;
    context0: {
      width: number;
      lastChr?: string;
      lastCode: number;
      nextChr?: string;
      nextCode: number;
      seenRepetitions: boolean[];
    };
    context1: {
      width: number;
      chr?: string;
      chrCode: number;
    };
    context: {
      width: number;
      lastChr?: string;
      lastCode: number;
      nextChr?: string;
      nextCode: number;
      seenRepetitions: boolean[];
      width: number;
      chr?: string;
      chrCode: number;
    };
    prevNode?: Node;
    node?: Node;
    root: Match;
    match: Match;
    global: boolean;
    repetitionCount: number;
    constructor(pattern: any);
    get done(): boolean;
    feed(chr?: string | null): void;
    startTraversal(match: Match): void;
    fail(): void;
    succeed(captures?: any): void;
    explode(matchers: any): void;
    apply(state: any): void;
    step0(): void;
  }

  export { Node, Sequence, Match, Engine };
}
