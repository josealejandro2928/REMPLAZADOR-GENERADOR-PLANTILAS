var fs = require('fs');
const Path = require('path');
var jsbeautify = require('./extras/js-beautify').js;
var htmlbeautify = require('./extras/js-beautify').html;
var cssbeautify = require('./extras/js-beautify').css;

function navigateFolders(path) {
    let document = fs.readdirSync(path);
    createFolder(path);
    for (let i = 0; i < document.length; i++) {
        let itemDoc = document[i];
        let childrenPath = `${path}/${itemDoc}`;
        if (fs.statSync(childrenPath + '').isDirectory()) {
            navigateFolders(childrenPath);
        } else {
            processFunction(childrenPath);
        }

    }
}

function processFunction(path) {
    let document = fs.readFileSync(path, 'utf-8');
    document = remplaceNames(document);
    let arrayItems = document.split('//startRemplace');
    let final = arrayItems[0];

    for (let i = 1; i < arrayItems.length; i++) {
        let arrayItemsEnd = arrayItems[i].split('//endRemplace');
        let runString = arrayItemsEnd[0];
        final += eval(runString + `run(schema)`);
        final += arrayItemsEnd[1];
    }
    let extention = path.split('.').pop();

    if (extention == 'js') {
        final = jsbeautify(final, {
            indent_size: 4
        })
    }
    if (extention == 'ts') {
        final = jsbeautify(final, {
            indent_size: 2
        })
    }
    if (extention == 'html') {
        final = htmlbeautify(final, {
            indent_size: 4
        })
    }
    if (extention == 'css' || extention == 'scss' || extention == 'sass') {
        final = cssbeautify(final, {
            indent_size: 4
        })
    }

    let path1 = remplacePath(path);
    fs.writeFileSync(path1, final);
    // console.log(final);
}

function remplaceNames(stringData) {
    let arrayNames = Object.keys(names);
    for (let nameItem of arrayNames) {
        let stringSust = names[nameItem];
        // console.log("remplaceNames -> stringSust", stringSust);
        let arrayItems = stringData.split(nameItem);
        stringData = arrayItems.join(stringSust);
    }
    return stringData;
}

function createFolder(path) {
    path = remplacePath(path);
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
}

function remplacePath(path) {
    path = path.split('origen').join('result');
    path = remplaceNames(path);
    return path;
}

function destroyResult(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach((file, index) => {
            const curPath = Path.join(path, file);
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                destroyResult(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}


var schema = require('./build-schema')['schema'];
var names = require('./build-schema')['names'];
destroyResult('./result');
createFolder('./result');
navigateFolders('./origen');