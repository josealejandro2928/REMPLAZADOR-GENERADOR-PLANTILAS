'use strict';

var tableName = '&[Name]&';

module.exports = {
    up: function (queryInterface, Sequelize) {
        var tableDefinition = {
            "id": {
                "type": Sequelize.INTEGER,
                "primaryKey": true,
                "autoIncrement": true
            },
           //startRemplace
        function run(schema){  
            let result = '';
            for(let key in schema){
                if(schema[key].type == "REFERENCE" && schema[key].isMultiple ){
                    result += '';
                }else{
                    result += `"${key}":{ \n \t`;
                }
                switch (schema[key].type) {
                    case "STRING":
                        result+=`"type": Sequelize.STRING, \n \t`;
                        break;
                    case "BOOLEAN":
                        result+=`"type": Sequelize.BOOLEAN, \n \t`;
                        break;
                    case "LONG-STRING":
                        result+=`"type": Sequelize.TEXT('long'), \n \t`;
                        break;
                    case "IMAGE":
                        result+=`"type": Sequelize.STRING, \n \t`;
                        break;
                    case "JSON":
                        result+=`"type": Sequelize.TEXT('long'), \n \t`;
                        break;
                    case "DATE":
                        result+=`"type": Sequelize.DATE, \n \t`;
                    case "DATEONLY":
                        result+=`"type": Sequelize.DATEONLY, \n \t`;
                    break;
                    case "NUMBER":
                        if(schema[key].isDecimal){
                            result+=`"type": Sequelize.DOUBLE, \n \t`;
                        }else{
                            result+=`"type": Sequelize.INTEGER, \n \t`;
                        }
                    break;
                    case "ENUM":
                        result+=`"type": Sequelize.ENUM,
                        "values":${JSON.stringify(schema[key].values)},
                        "defaultValue": "${schema[key].values[0]}",`;
                    break;
                    case "REFERENCE":
                        if(!schema[key].isMultiple){
                            result+=`"type": Sequelize.INTEGER,\t
                            "references": {
                                "model": "${schema[key].targetTable}",
                                "key": "id"
                            },
                            "onUpdate": "cascade",
                            "onDelete": "cascade",`
                        }
                    break;
                }
                if(schema[key].type == "REFERENCE" && schema[key].isMultiple ){
                    result += '';
                }else{
                    if(schema[key].isRequired){
                        result+=`"allowNull":false,\n\t`;
                    }
                    if(schema[key].isEmail){
                        result+=`"isEmail":true,\n\t`;
                    }
                    if(schema[key].unique){
                        result+=`"unique":true,\n\t`;
                    }
                    if(schema[key].isPassword){
                        result+=`set: function (_new${key}) {
                            var rounds = 8;
                            var hashed${key} = bcrypt.hashSync(_new${key}, rounds);
                            this.setDataValue('${key}', hashed${key});
                        }`
                    }
                    result +=`}\n,`
                }
             
            }
            return result;
        } 
    //endRemplace
            "createdAt": {
                "type": Sequelize.DATE
            },
            "updatedAt": {
                "type": Sequelize.DATE
            },
            "deletedAt": {
                "type": Sequelize.DATE
            },
        };
        return queryInterface
            .createTable(tableName, tableDefinition);
    },
    down: function (queryInterface) {
        return queryInterface.dropTable(tableName);
    }
};