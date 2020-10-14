/*
Persona{
   name: '' +
   description: txt
   email:'' + @
   age:12 >=0 <=120
   image:img
   password: '' **
   CargoId: Cargo
   Task:[Task] name
   rango: '1|2|3'
}
*/
var fs = require("fs");
var names = require("./extras/names");
var jsbeautify = require("./extras/js-beautify").js;

function getTableName(string) {
  let tableName = string.split("{")[0];
  return tableName;
}

function getAtributes(string) {
  let atributes = string.split("{")[1].split("}")[0].split("\n");
  let data = {};
  console.log(atributes);
  for (let key of atributes) {
    if (key.length > 3) {
      let properties = key.split(":")[1].split("\r")[0].trim().split(" ");
      let atribute = key.split(":")[0].trim();
      data[atribute] = getProperties(atribute, properties);
    }
  }
  return data;
}

function getProperties(attribute, properties) {
  /*
     name: '' +
     {
         type: "STRING",
         isRequired: true
     }
     description: txt
    {
         type: "LONG-STRING"
     }
    Task:[Task] name
    {
        type: "REFERENCE"
        isMultiple: true
        targetTable: "Task"
        targetAttribute: "name"
    }
    */
  let result = {};
  switch (properties[0]) {
    case "''":
      result.type = "STRING";
      break;
    case "txt":
      result.type = "LONG-STRING";
      break;
    case "bool":
      result.type = "BOOLEAN";
      break;
    case "img":
      result.type = "IMAGE";
      break;
    case "json":
      result.type = "JSON";
      break;
    case "date":
      result.type = "DATE";
      break;
    case "dateonly":
      result.type = "DATEONLY";
      break;
    default:
      if (isNaN(properties[0]) == false) {
        result.type = "NUMBER";
        if (properties[0].indexOf(".") != -1 || properties[0].length > 6) {
          result.isDecimal = true;
        }
        break;
      } else if (properties[0].startsWith("[")) {
       
        let a ='';
        result.type = "REFERENCE";
        result.isMultiple = true;
        let metaDataTable = properties[0].split("[")[1].split("]")[0];
        console.log("getProperties -> result.targetTable", metaDataTable)
        result.targetTable = metaDataTable.split('->')[0]
        result.oneToMany = (metaDataTable.split('->')[1])?false:true
        result.manyToMany = (metaDataTable.split('->')[1])?true:false
        result.throughTable = (result.manyToMany)?metaDataTable.split('->')[1]:null;
      } else if (attribute.endsWith("Id")) {
        result.type = "REFERENCE";
        result.targetTable = properties[0];
      } else if (properties[0].indexOf("|") != -1) {
        result.type = "ENUM";
        result.values = properties[0]
          .substring(1, properties[0].length - 1)
          .split("|");
        result.defaultValue = result.values[0];
      }
  }

  for (let i = 1; i < properties.length; i++) {
    let prop = properties[i];
    if (prop == "+") {
      result.isRequired = true;
    } else if (prop == "@") {
      result.isEmail = true;
    } else if (prop == "**") {
      result.isPassword = true;
    } else if (prop == "show") {
      result.showFieldInTable = true;
    } else if (prop == "u") {
      result.unique = true;
    } else if (prop.startsWith("trans") && result.type == "JSON") {
      result.isForTranslate = true;
    } else if (prop.startsWith("s=")) {
      result.targetAttribute = prop.split("=")[1];
    } else if (prop.includes(">=")) {
      result.min = +prop.split(">=")[1];
    } else if (prop.includes("<=")) {
      result.max = +prop.split("<=")[1];
    } else if (prop.includes(">")) {
      result.min = +prop.split(">")[1];
    } else if (prop.includes("<")) {
      result.max = +prop.split("<")[1];
    } else if (prop.startsWith("width=")) {
      result.fxFlex = +prop.split("=")[1];
    } else if (prop.startsWith("ref-create")) {
      result.createReference = true;
      result.referenceFields = prop.split("=")[1].split(",") || [];
    } else if (prop == "no-create") {
      result.noCreate = true;
    }
  }
  return result;
}

function generateNames(string) {
  let tableName = getTableName(string);
  var a = {
    "&[na-me]&": names.urlize(tableName),
    "&[na-mes]&": names.urlize(tableName) + "s",
    "&[name]&": names.varize(tableName),
    "&[names]&": names.varize(tableName) + "s",
    "&[Name]&": names.fileNameToModelName(tableName),
    "&[Names]&": names.fileNameToModelName(tableName) + "s",
  };
  return a;
}

function run(structString) {
  let dataOutput = {
    schema: {},
    names: {},
  };
  dataOutput.schema = getAtributes(structString);
  dataOutput.names = generateNames(structString);
  var a = jsbeautify(JSON.stringify(dataOutput), {
    indent_size: 4,
  });
  fs.writeFileSync("schema.json", a);
  return dataOutput;
}

/*
 */
let data = fs.readFileSync("./struct.json", "utf-8");
module.exports = run(data);
