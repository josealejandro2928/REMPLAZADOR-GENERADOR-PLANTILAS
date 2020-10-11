
exports.registry = function registry() {
  var models   = global.app.orm.sequelize.models;
  var apiRoute = global.app.config.get('api:prefix');

  var &[name]&CollectionRoute = apiRoute + '/&[na-me]&';

  global.app.express.route(&[name]&CollectionRoute)
        .post(global.security.ensureAuthenticated(),global.security.ensureHasRol('Admin'),require('./create'))
        .get(require('./index'));

  var &[name]&SingleRoute = &[name]&CollectionRoute + '/:&[name]&Id';

  global.app.express.route(&[name]&SingleRoute)
        .patch(global.security.ensureAuthenticated(),global.security.ensureHasRol('Admin'),ensure&[Name]&Id,require('./update'))
        .get(ensure&[Name]&Id,require('./show'))
        .delete(global.security.ensureAuthenticated(),global.security.ensureHasRol('Admin'),ensure&[Name]&Id,require('./delete'));

  async function ensure&[Name]&Id (req,res,next){
    let &[name]&Id = req.params.&[name]&Id || -1; 
    try{
      let &[name]& = await models.&[Name]&.findByPk(&[name]&Id, {include: [{all: true}]});
      if (!&[name]&) {
       let e = new Error(`El recurso solicitado no existe: No hay referencia de ningun record con &[name]&Id = ${&[name]&Id}`);
       e.status = 404;
       throw(e);
      }
      req.&[name]& = &[name]&;
      return next();
    }catch(error){
      return res.status(error.status||500).json({errors:[{message:error.message}]})

    }

  }
};
