
// return union of given objects
function extend(...args){
    if(args.length < 2){
        throw 'Please provide atleast 2 objects!';
    }else{
        for(let i=0; i<args.length; i++){
            if(typeof(args[i]) != 'object'){
                throw 'Please pass valid object!';
            }else if(args[i] == undefined){
                throw 'object is not defined!';
            }
        }

        var finalObj = args[0];

        for(let j=1; j<args.length; j++){            
            for (var key in args[j]) {
                if(!finalObj.hasOwnProperty(key)){
                    finalObj[key] = args[j][key];
                }
            }
        }
        return finalObj;
    }    
}

function smush(...args){
    if(args.length < 2){
        throw 'Please provide atleast 2 objects!';
    }else{
        for(let i=0; i<args.length; i++){
            if(typeof(args[i]) != 'object'){
                throw 'Please pass valid object(s)!';
            }else if(args[i] == undefined){
                throw 'object is not defined!';
            }
        }

        var finalObj = args[0];
        for(let j=1; j<args.length; j++){            
            for (var key in args[j]) {
                finalObj[key] = args[j][key];
            }
        }
        return finalObj;
    }
}

function mapValues(object, func){
    if(object == undefined){
        throw 'Please pass an object!';
    }else if(typeof(object) != 'object'){
        throw 'Object type is invalid!';
    }else if(func == undefined){
        throw 'Please pass a function!';
    }else if(typeof(func) != 'function'){
        throw 'Function type is invalid!';
    }else{        
        for(var key in object){
            object[key] = func(object[key])
        }
        return object;
    }
}

// export functions
module.exports = {
    extend,
    smush,
    mapValues
}