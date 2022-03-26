/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const Partie_accueille = sequelize.define('partie_accueille', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    id_membre: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    id_partie: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_type_partie: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'type_partie',
        key: 'id_type_partie'
      }
    },
    n_joueur: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    vainqueur: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    heure_creation: {
      type: DataTypes.DATEONLY,
      defaultValue: sequelize.NOW
    }
  }, {
    tableName: 'partie_accueille'
  });
  return Partie_accueille;
};
