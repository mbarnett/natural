/*
Copyright (c) 2011, Chris Umbel
Modified for multiclassification (c) 2011, Matthew Barnett <matt@wtmworldwide.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

var natural = require('natural'),
    classifier = new natural.BayesClassifier();

classifier.train([
	{classification: 'software', text: "my unit-tests failed."},
	{classification: 'software', text: "tried the program, but it was buggy."},
	{classification: 'hardware', text: "the drive has a 2TB capacity."},
	{classification: 'hardware', text: "i need a new power supply."}
]);

console.log(classifier.classify('did the tests pass?'));
console.log(classifier.classify('did you buy a new drive?'));
console.log(classifier.multiclassify('I wish Jeff\'s harddrive didn\'t suck'));
