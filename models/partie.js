/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const Partie = sequelize.define('partie', {
    id_partie: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    vainqueur: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'partie'
  });
  return Partie;
};
