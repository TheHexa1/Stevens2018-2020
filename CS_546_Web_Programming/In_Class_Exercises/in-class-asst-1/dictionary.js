const vocab = {
    programming: "The action or process of writing computer programs.",
    charisma: "A personal magic of leadership arousing special popular loyalty or enthusiasm for" + 
                "a public figure (such as a political leader)",
    sleuth: "To act as a detective : search for information",
    foray: "A sudden or irregular invasion or attack for war or spoils : raid",
    adjudicate: "to make an official decision about who is right in (a dispute) : to settle judicially"
}

function checkInput(str){
    if (typeof str !== 'string'){
        throw `${str} is not a string`;
    }
    return str;
}

function lookupDefinition(str){
    checkInput(str);

    if(vocab[str] != undefined){
        return vocab[str];
    }else{
        throw `${str} is not defined in the dictionary`;
    }
}

function getWord(str){
    checkInput(str);

    let key = Object.keys(vocab).find(key => vocab[key] === str);

    if(key == undefined){
        throw `${str} is not a definition in dictionary`;
    }

    return key;
}

module.exports = {
    lookupDefinition,
    getWord
}