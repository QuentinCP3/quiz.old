/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const Stat = sequelize.define('stats', {
    id_stats: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    nbre_bonnes_rep: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    nbre_mauvaises_rep: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
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
    bonnes_rep_sports: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    mauvaises_rep_sports: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    bonnes_rep_arts_litte: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    mauvaises_rep_arts_litte: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    bonnes_rep_cine_series: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    mauvaises_rep_cine_series: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    bonnes_rep_musique: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    mauvaises_rep_musique: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    bonnes_rep_histoire: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    mauvaises_rep_histoire: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    bonnes_rep_geo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    mauvaises_rep_geo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    bonnes_rep_sciences_nat: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    mauvaises_rep_sciences_nat: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    bonnes_rep_techno: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    mauvaises_rep_techno: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    bonnes_rep_eco_societe: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    mauvaises_rep_eco_societe: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    bonnes_rep_blind_test: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    mauvaises_rep_blind_test: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    tableName: 'stats'
  });
  return Stat;
};
