/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const Pose = sequelize.define('pose', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    id_partie: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'partie',
        key: 'id_partie'
      }
    },
    id_question: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'question',
        key: 'id_question'
      }
    },
    rep_joueur_1: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rep_joueur_2: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rep_joueur_3: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rep_joueur_4: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    pts_joueur_1: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    pts_joueur_2: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    pts_joueur_3: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    pts_joueur_4: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    n_question: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'pose'
  });
  return Pose;
};
