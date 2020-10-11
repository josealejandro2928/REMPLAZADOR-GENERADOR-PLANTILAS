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
            "CreatorId": {
                "type": Sequelize.INTEGER,
                "references": {
                    "model": "Person",
                    "key": "id"
                },
                "onUpdate": "cascade",
                "onDelete": "cascade"

            },
            "link": {
                "type": Sequelize.TEXT('long')

            },
            "title": {
                "type": Sequelize.TEXT('long')

            },
            "subTitle": {
                "type": Sequelize.TEXT('long')

            },
            "text": {
                "type": Sequelize.TEXT('long')

            },

            "createdAt": {
                "type": Sequelize.DATE
            },
            "updatedAt": {
                "type": Sequelize.DATE
            },
            "deletedAt": {
                "type": Sequelize.DATE
            },
            'status': {
                "type": Sequelize.ENUM,
                "values": ["pending", "enabled", "disabled"],
                "defaultValue": "pending"
            }
        };
        return queryInterface
            .createTable(tableName, tableDefinition);
    },
    down: function (queryInterface) {
        return queryInterface.dropTable(tableName);
    }
};