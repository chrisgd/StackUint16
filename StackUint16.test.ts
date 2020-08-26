import * as Stack from './StackUint16';

test('stack creation', () => {
  let s = Stack.makeStack();
  expect(Stack.length(s)).toBe(0);
  expect(Stack.capacity(s)).toBe(128);

  expect(() => {
    Stack.top(s);
  }).toThrow('empty StackUInt16');
});

test('Stack pushing', () => {
  let s = Stack.makeStack();
  // try a simple push
  expect(Stack.length(Stack.push(s, 0xffff))).toBe(1);
  expect(Stack.top(s)).toBe(0xffff);

  // test to see if it's really 16 bits
  expect(Stack.length(Stack.push(s, 0x10000))).toBe(2);
  expect(Stack.top(s)).toBe(0);

  expect(Stack.length(Stack.push(s, 0xff00))).toBe(3);
  expect(Stack.top(s)).toBe(0xff00);
});

test('Stack popping', () => {
  let s = Stack.makeStack();
  Stack.push(s, 0xff00);
  Stack.push(s, 0x00ff);
  Stack.push(s, 0xf00f);
  Stack.push(s, 0xf0f0);
  Stack.push(s, 0x0ff0);

  expect(Stack.length(s)).toBe(5);

  expect(Stack.pop(s)).toBe(0x0ff0);
  expect(Stack.pop(s)).toBe(0xf0f0);
  expect(Stack.pop(s)).toBe(0xf00f);
  expect(Stack.pop(s)).toBe(0x00ff);
  expect(Stack.pop(s)).toBe(0xff00);

  expect(() => {
    Stack.pop(s);
  }).toThrow('StackUInt16 underflow');
});

test('turning a Stack into and back from a string', () => {
  let s = Stack.makeStack();
  Stack.push(s, 0xff00);
  Stack.push(s, 0x00ff);
  Stack.push(s, 0xf00f);
  Stack.push(s, 0xf0f0);
  Stack.push(s, 0x0ff0);
  let ss = Stack.stackToString(s);
  let s2 = Stack.stringToStack(ss);
  expect(s._data).toEqual(s2._data);
  expect(Stack.length(s)).toEqual(Stack.length(s2));
  expect(Stack.top(s)).toEqual(Stack.top(s2));
});
