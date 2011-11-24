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

var PorterStemmer = require('../stemmers/porter_stemmer'),
     sys = require('sys'),
     Classifier = require('./classifier');

var BayesClassifier = function(stemmer) {
    Classifier.call(this, stemmer);
    this.categories = {};
    this.categoryTotals = {};
};

sys.inherits(BayesClassifier, Classifier);

function addDocument(text, classification) {
     var category = classification;
     var tokens = this.textToTokens(text);
     var classifier = this;
     
    if(typeof category === "string") {
        if(!classifier.categories[category]) {
            classifier.categories[category] = {};
            classifier.categoryTotals[category] = 0;
        }

        tokens.forEach(function(token) {
            classifier.categoryTotals[category]++;
     
            if(classifier.categories[category][token]) {
                classifier.categories[category][token]++;
            } else {
                classifier.categories[category][token] = 1;
            }
        });
    } else {
        category.forEach(function(cat) {
            if(!classifier.categories[cat]) {
                classifier.categories[cat] = {};
                classifier.categoryTotals[cat] = 0;
            }
        });

        tokens.forEach(function(token) {
            category.forEach(function(cat) {
                classifier.categoryTotals[cat]++;
     
                if(classifier.categories[cat][token]) {
                    classifier.categories[cat][token]++;
                } else {
                    classifier.categories[cat][token] = 1;
                }
            });
        });
    }
}

function classifications(text) {
    var tokens = this.textToTokens(text);
    var classifier = this;
    var score = {};

    for(var category in this.categories) {
        score[category] = 0;

        tokens.forEach(function(token) {
            var count = classifier.categories[category][token] || 0.1;
            score[category] += Math.log(count / classifier.categoryTotals[category]);
        });
    };

    return score;
}

function classify(text) {
     return this.getClassification(text).className;
}

function multiclassify(text) {
    return this.getTopClassifications(text);
}

function getClassification(text) {
    var scores = this.classifications(text);
    var category = {};

    for(candidate in scores) {
        if(!category["className"] || scores[candidate] > category["value"]) {
            category = {"className": candidate, "value": scores[candidate]};
        }
    }

    return category;
}

function getTopClassifications(text) {
    var scores = this.classifications(text);
    var first = {};
    var second = {};
    var third = {};

    for(candidate in scores) {
        if(!first["className"] || scores[candidate] > first["value"]) {
            third = second;
            second = first;
            first = {"className": candidate, "value": scores[candidate]};
        } else if(!second["className"] || scores[candidate] > second["value"]) {
            third = second;
            second = {"className": candidate, "value": scores[candidate]};
        } else if(!third["className"] || scores[candidate] > third["value"]) {
            third = {"className": candidate, "value": scores[candidate]};
        }
    }

    return [first["className"] ? first.className : null, second["className"] ? second.className : null, third["className"] ? third.className : null];
}

function load(filename, callback) {
     Classifier.load(filename, function(err, classifier) {
          callback(err, restore(classifier));
     });
}

function restore(classifier, stemmer) {
     classifier = Classifier.restore(classifier, stemmer);
     classifier.__proto__ = BayesClassifier.prototype;
     
     return classifier;
}

BayesClassifier.prototype.classifications = classifications;
BayesClassifier.prototype.classify = classify;
BayesClassifier.prototype.multiclassify = multiclassify;
BayesClassifier.prototype.getClassification = getClassification;
BayesClassifier.prototype.addDocument = addDocument;
BayesClassifier.prototype.getTopClassifications = getTopClassifications;
BayesClassifier.load = load;
BayesClassifier.restore = restore;

module.exports = BayesClassifier;
