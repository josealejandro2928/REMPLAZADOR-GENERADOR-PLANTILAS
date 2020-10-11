'use strict';
  
exports.loadModels = function loadModels() {
    require('./models/&[na-me]&.js').loadModel();
  
};

exports.loadTasks = function loadTasks() {
  
};

exports.setRoutes = function setRoutes() {
    require('./routes/&[na-me]&/registry').registry();
  
};




