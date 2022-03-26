/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var bCrypt = require('bcrypt-nodejs');
  var User = sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: true
    },
    pass: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true
    },
    date_inscription: {
      type: DataTypes.DATE,
      allowNull: false
    },
    date_naissance: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    parties_gratuites: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    partie: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    running: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'user'
  });

  User.generateHash =  function(password){
          return bCrypt.hashSync(password,bCrypt.genSaltSync(8),null);
        };
  User.validPassword =  function(user,password){
    console.log('isitvalidpass');
          return bCrypt.compareSync(password,user);
        };

  return User;
};
