const fs        = require('fs');
const path      = require('path');
const Sequelize = require('sequelize');
const basename  = path.basename(module.filename);
const env       = 'development';
const config    = require(__dirname + '/../config/config.json')[env];
const db        = {};

const sequelize = new Sequelize(config.database,config.username,config.password, {host:config.host,dialect: config.dialect,define: {timestamps: false}});

fs
.readdirSync(__dirname)
.filter((file) => {
  return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
})
.forEach((file) => {
  const model = sequelize['import'](path.join(__dirname, file));
  db[model.name] = model;
});

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

//db.match.belongsTo(db.sport,{onDelete: 'cascade',foreignKey : 'sports'});


//db.match.belongsTo(db.equipe,{foreignKey:'equipe_l',as: 'equipe_loc'});


//db.match.belongsTo(db.equipe,{foreignKey:'equipe_v',as: 'equipe_vis'});
// db.equipe.hasMany(db.match,{foreignKey:"id",onDelete: 'cascade'});

//db.ligue.belongsTo(db.sport,{onDelete: 'cascade',foreignKey:'sports'});
//db.sport.hasMany(db.ligue,{foreignKey:'id'});

//db.equipe.belongsTo(db.ligue);
//db.ligue.hasMany(db.equipe);

//db.equipe_poste_joueur.belongsTo(db.joueur,{foreignKey:'joueurs',onDelete: 'cascade'});
//db.joueur.hasMany(db.equipe_poste_joueur,{foreignKey:'joueurs'});


//db.equipe_poste_joueur.belongsTo(db.equipe,{foreignKey:'equipes'});
// db.equipe.hasMany(db.equipe_poste_joueur,{foreignKey:'id'});

//db.equipe_poste_joueur.belongsTo(db.poste,{foreignKey:'postes'});
// db.poste.hasMany(db.equipe_poste_joueur,{foreignKey:'id'});



sequelize
.authenticate()
.then(() => {
 console.log('Connection établie.');
      // sequelize.sync({force:true});
      sequelize.sync();
    })
.catch((err) => {
 console.log('Connection impossible :', err);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Import Models such that I can use them in the api just by importing 'db'
// db.User = require('./user')(sequelize, Sequelize);
// db.Joueur = require('./joueur')(sequelize,Sequelize);


module.exports = db;
