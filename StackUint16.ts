/**
 * Interface for the stack type.
 */
export interface StackUint16 {
  _buffer: ArrayBuffer;
  _data: Uint16Array;
  _top: number;
  top: (() => number) | null;
  pop: (() => number) | null;
  push: ((num: number) => StackUint16) | null;
  length: (() => number) | null;
  capacity: (() => number) | null;
}

/** Default size of the stack */
export const DEFAULT_SIZE = 256;

/**
 * Creates a new empty stack with the default size or with a specified initial size.
 * @param initSize the initial size of the stack, but it's optional, in
 * which case it will be DEFAULT_SIZE.
 */
export function makeStack(initSize?: number): StackUint16 {
  let buf = new ArrayBuffer(initSize ? initSize : DEFAULT_SIZE);
  let dat = new Uint16Array(buf);

  let s = {} as StackUint16;
  s._buffer = buf;
  s._data = dat;
  s._top = 0;
  s['top'] = () => {
    return top(s);
  };
  s['pop'] = () => {
    return pop(s);
  };
  s['push'] = (num: number) => {
    return push(s, num);
  };
  s['length'] = () => {
    return length(s);
  };
  s['capacity'] = () => {
    return capacity(s);
  };

  return s;
}
/**
 * Returns the top value from the stack without popping it (like a peek)
 * @param stack the stack in question
 */
export function top(stack: StackUint16): number {
  if (stack._top === 0) throw Error('empty StackUInt16');
  return stack._data[stack._top - 1];
}

/**
 * Pushes the val onto the top of the stack
 * @param stack the stack we are working with
 * @param val the uint16 value to push
 */
export function push(stack: StackUint16, val: number): StackUint16 {
  if (stack._top === stack._data.length) {
    // double its size
    let bufferCopy = new ArrayBuffer(stack._buffer.byteLength * 2);
    let dataCopy = new Uint16Array(bufferCopy);

    /* copy over everything */
    for (let i = 0; i < stack._data.length; i++) {
      dataCopy[i] = stack._data[i];
    }

    stack._buffer = bufferCopy;
    stack._data = dataCopy;
  }

  stack._data[stack._top] = val;
  stack._top++;

  return stack;
}

/**
 * multiPop pops num elements from the stack, simply throwing them away, and
 * returning only the bottom most of these
 * @param stack stack we are working with
 * @param num number of elements to pop
 */
export function multiPop(stack: StackUint16, num: number) {
  if (num > length(stack)) throw Error('StackUint16 underflow in multiPop');

  // well this should be fine--as long as we don't resize
  // before we return the value (so don't do that)
  stack._top -= num;
  return stack._data[stack._top];
}

/**
 * Pops the top element of the stack and returns it. Throws an error if it's empty.
 * @param stack the stack we are working with
 */
export function pop(stack: StackUint16): number {
  if (stack._top === 0) throw new Error('StackUInt16 underflow in pop');

  let res = top(stack);
  stack._top--;
  return res;
}

/**
 * Returns the number of elements on the stack.
 * @param stack the stack we are working with
 */
export function length(stack: StackUint16): number {
  return stack._top;
}

/**
 * Returns the number of elements the stack will currently hold
 * (note that this just gets bigger if you fill the stack up)
 * @param stack the stack we are working with
 */
export function capacity(stack: StackUint16): number {
  return stack._data.length;
}

/**
 * Returns the given element on the stack.
 * @param stack stack we are working with
 * @param index index of element in stack to retrieve
 */
export function get(stack: StackUint16, index: number): number {
  return stack._data[index];
}

/**
 * sets the element in the given stack to be the new value
 * @param stack stack we are working with
 * @param index index of element in stack we wish to change
 * @param val value to assign to the indexed element
 */
export function set(stack: StackUint16, index: number, val: number) {
  stack._data[index] = val;
}

/**
 * Shrinks the size to now be the given index. This becomes the new 'top'.
 * @param stack the stack we are working with
 * @param index the index to shrink the stack to (must be <= Stack.length(stack))
 */
export function setTop(stack: StackUint16, index: number) {
  if (index > stack._top)
    throw Error(
      "you shouldn't really arbitrarily add elements to the stack top without push"
    );

  stack._top = index;
}

export function stackToString(stack: StackUint16) {
  let s = '';
  let bytes = stack._data;
  let count = length(stack);
  for (let i = 0; i < count; i++) {
    let val = bytes[i];
    let n1 = (val & 0xff00) >> 8;
    let n2 = val & 0x00ff;
    //console.log('val: 0x' + val.toString(16) + ', n1: 0x' + n1.toString(16) + ', n2: 0x' + n2.toString(16));
    s += String.fromCharCode(n1);
    s += String.fromCharCode(n2);
  }
  return s;
}

export function stringToStack(str: string) {
  let s = makeStack();
  //console.log('string length: ' + str.length);
  for (let i = 0; i < str.length - 1; i += 2) {
    // now, walk through the characters and turn them into values
    let n1 = str.charCodeAt(i);
    let n2 = str.charCodeAt(i + 1);
    let val = (n1 << 8) | n2;
    push(s, val);
  }
  return s;
}
