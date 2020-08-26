Introduction
============
StackUint16 is just a simple package using TypeScript that implements a stack. 
It has the usual stack things, pushing and popping things to and from the stack, 
except that they can only be 16-bit unsigned integers, nothing else. 

Why? Why not just another stack? First, TypeScript catches errors in use so that
you don't put unexpected things on it, and second, because sometimes you need a
stack of 16-bit unsigned integers...discovering those uses is an exercise left to
the reader.

Usage
-----
Begin by calling makeStack, giving it the initial size of the stack. It defaults
to 256 elements. You can push and pop arbitrarily, including a multiPop which
will pop multiple elements. 

The stack automatically grows in size. It doesn't really shrink since that's 
often not needed, though asymptotically it'd make sense to implement shrinkage
at 1/4 or so capacity (as long as it shrinks multiplicatively).