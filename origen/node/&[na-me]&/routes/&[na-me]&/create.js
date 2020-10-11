'use strict';


module.exports = create&[Name]&;

async function create&[Name]& (req, res) {
  var models = global.models;
  var jsonAPI = global.app.utils.jsonAPI;
  var jsonAPIBody = {
    data: {}
  };

  try {
    let &[name]& = await global.db.sequelize.transaction(async (t) => {
        let data = await models.&[Name]&.create(req.body, {
          transaction: t
        });
        return data
    })
    jsonAPIBody.data = &[name]&.toJSON();
    return res.status(201).json(jsonAPIBody); // OK.
  } catch (error) {
    global.app.utils.logger.error(error, {
      module: '&[na-me]&/create',
      submodule: 'routes',
      stack: error.stack
    });
    return res.status(error.status||500)
      .json(jsonAPI.processErrors(error, req, {
        file: __filename
      }));
  }
}