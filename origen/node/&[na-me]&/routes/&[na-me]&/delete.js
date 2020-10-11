'use strict';

module.exports = delete&[Name]&;


async function delete&[Name]& (req, res) {
  var jsonAPI = global.app.utils.jsonAPI;
  try {
    await req.&[name]&.destroy();
    return res.sendStatus(204); // No Content.
  } catch (error) {
    global.app.utils.logger.error(error, {
      module: '&[na-me]&/delete',
      submodule: 'routes',
      stack: error.stack
    });
    return res.status(error.status || 500).json(jsonAPI.processErrors(error, req, {
      file: __filename
    }));
  }
};