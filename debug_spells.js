
const fs = require('fs');
const spells = require('./src/lib/data/spells.json');

const classSet = new Set();
spells.forEach(s => {
    if (Array.isArray(s.classes)) {
        s.classes.forEach(c => classSet.add(c));
    } else {
        classSet.add(s.classes);
    }
});

console.log("Found Classes:", Array.from(classSet));
