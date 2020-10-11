'use strict';

module.exports = list&[Name]&


async function list&[Name]& (req, res) {
  var models = global.models;
  var jsonAPI = global.app.utils.jsonAPI;

  var jsonAPIBody = {
    meta: {
      pagination: {}
    },
    data: []
  };

  var query = jsonAPI.buildQueryFromReq({
    req: req,
    model: models.&[Name]&
  });

  query = jsonAPI.prepareQuery(query);

  /*query includes put here*/

  try {
    let &[names]& = await models.&[Name]&.findAll(query);
    jsonAPIBody.data = &[names]&;
    jsonAPIBody.meta.pagination.count = &[names]&.length;
    global.app.utils.jsonAPI.cleanQuery(query);
    let total = await models.&[Name]&.count(query);
    jsonAPIBody.meta.pagination.total = total;
    return res.status(200).json(jsonAPIBody); // OK.

  } catch (error) {
    console.log("***ERROR LISTANDO***", error)
    return res.status(error.status || 500).json({
      errors: [{
        message: error.message
      }]
    });
  }
};
