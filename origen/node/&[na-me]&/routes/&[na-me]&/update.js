'use strict';

module.exports = update&[Name]&;

async function update&[Name]&(req, res) {

  var jsonAPI = global.app.utils.jsonAPI;
  var models = global.models;

  try{
    let &[name]& = await global.db.sequelize.transaction(async (t) => {
                      await req.&[name]&.update(req.body,{transaction:t});
                      let data = await models.&[Name]&.findByPk(req.&[name]&.id, {include: [{all: true}],transaction:t});
                      return data
                   })
    return res.status(200).json({data:&[name]&.toJSON()}); // OK.
  }catch(error){
    global.app.utils.logger.error(error, {
      module: '&[name]&/update',
      submodule: 'routes',
      stack: error.stack
    });
    return res.status(error.status || 500)
      .json(jsonAPI.processErrors(error, req, {
        file: __filename
      }));

  }

};