var fs = require("fs");
const Path = require("path");
var jsbeautify = require("./extras/js-beautify").js;
var htmlbeautify = require("./extras/js-beautify").html;
var cssbeautify = require("./extras/js-beautify").css;

function navigateFolders(path, names, schema) {
  let document = fs.readdirSync(path);
  createFolder(path, names, schema);
  for (let i = 0; i < document.length; i++) {
    let itemDoc = document[i];
    let childrenPath = `${path}/${itemDoc}`;
    if (fs.statSync(childrenPath + "").isDirectory()) {
      navigateFolders(childrenPath, names, schema);
    } else {
      processFunction(childrenPath, names, schema);
    }
  }
}

function processFunction(path, names, schema) {
  let document = fs.readFileSync(path, "utf-8");
  document = remplaceNames(document, names);
  let arrayItems = document.split("//startRemplace");
  let final = arrayItems[0];

  for (let i = 1; i < arrayItems.length; i++) {
    let arrayItemsEnd = arrayItems[i].split("//endRemplace");
    let runString = arrayItemsEnd[0];
    final += eval(runString + `run(schema)`);
    final += arrayItemsEnd[1];
  }
  let extention = path.split(".").pop();

  if (extention == "js") {
    final = jsbeautify(final, {
      indent_size: 4,
    });
  }
  if (extention == "ts") {
    final = jsbeautify(final, {
      indent_size: 2,
    });
  }
  if (extention == "html") {
    final = htmlbeautify(final, {
      indent_size: 4,
    });
  }
  if (extention == "css" || extention == "scss" || extention == "sass") {
    final = cssbeautify(final, {
      indent_size: 4,
    });
  }

  let path1 = remplacePath(path, names, schema);
  fs.writeFileSync(path1, final);
  // console.log(final);
}

function remplaceNames(stringData, names) {
  let arrayNames = Object.keys(names);
  for (let nameItem of arrayNames) {
    let stringSust = names[nameItem];
    // console.log("remplaceNames -> stringSust", stringSust);
    let arrayItems = stringData.split(nameItem);
    stringData = arrayItems.join(stringSust);
  }
  return stringData;
}

function createFolder(path, names, schema) {
  path = remplacePath(path, names, schema);
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}

function remplacePath(path, names, schema) {
  path = path.split("origen").join("result");
  path = remplaceNames(path, names, schema);
  return path;
}

function destroyResult(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach((file, index) => {
      const curPath = Path.join(path, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        destroyResult(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}

destroyResult("./result");
let data = fs.readFileSync("struct.json", "utf-8");

data = data.split("}");
for (let i = 0; i < data.length; i++) {
  let temp = data[i];
  temp = temp.trim();
  console.log("temp", temp);
  if (temp != "" && temp != undefined) {
    temp = temp + "}";
    let schema = require("./build-schema")(temp)["schema"];
    let names = require("./build-schema")(temp)["names"];
    createFolder("./result", names, schema);
    navigateFolders("./origen", names, schema);
    renameMigrations(schema, names, i);
  }
}

/////////////////UTILS////////////
function renameMigrations(schema, names, index) {
  function parseNumberNotation(number) {
    if (number < 10) {
      return `000${number}`;
    }
    if (number < 100) {
      return `00${number}`;
    }
    if (number < 100) {
      return `0${number}`;
    }
    return "0000";
  }

  let oldPathMigration = Path.resolve(
    "result",
    "node",
    "migration",
    `0004-create-table-${names["&[na-me]&"]}.js`
  );
  let newPathMigration = Path.resolve(
    "result",
    "node",
    "migration",
    `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}-${
      parseNumberNotation(index + 1)
    }-create-table-${names["&[na-me]&"]}.js`
  );
  fs.rename(oldPathMigration, newPathMigration, (error) => {
    if (error) {
      console.log(error);
    }
  });
}
