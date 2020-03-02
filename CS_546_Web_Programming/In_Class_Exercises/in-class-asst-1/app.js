const dict = require('./dictionary');

try {
    console.log(dict.lookupDefinition('programming'));
} catch (e) {
    console.log(e);
}

try {
    console.log(dict.lookupDefinition('me'));
} catch (e) {
    console.log(e);
}

try {
    console.log(dict.lookupDefinition('search'));
} catch (e) {
    console.log(e);
}

try {
    console.log(dict.lookupDefinition('charisma'));
} catch (e) {
    console.log(e);
}

try {
    console.log(dict.getWord('to make an official decision about who is right in (a dispute) : to settle judicially'));
} catch (e) {
    console.log(e);
}

try {
    console.log(dict.getWord('this def is not available!'));
} catch (e) {
    console.log(e);
}