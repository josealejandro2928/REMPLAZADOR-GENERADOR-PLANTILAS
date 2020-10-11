module.exports = {
    urlize: urlize,
    varize: varize,
    fileNameToModelName: fileNameToModelName
}

/**
 * @transform
 * ExamplePeople
 * @to
 * example-people
 * */
function urlize(x) {
    console.log("XXXXXXXXX:", x)
    if (x) {
        x = x.replace(/([A-Z])/g, '-$1').toLowerCase();
    }
    if (x.startsWith('-')) {
        x = x.substring(1)
    }
    return x;
}

/**
 * @transform
 * example-people
 * @to
 * ExamplePeople
 * */
function fileNameToModelName(x) {
    if (x) {
        var w = x.split('-');
        x = "";
        for (var i = 0; i < w.length; i++) {
            x = x + w[i][0].toUpperCase() + w[i].substr(1)
        }
    }
    return x;
}

/**
 * @transform
 * ExamplePeople
 * @to
 * examplePeople
 * */
function varize(x) {
    if (x) {
        x = x[0].toLowerCase() + x.substr(1)
        x = x.replace(/-/g, '')
    }
    return x;
}