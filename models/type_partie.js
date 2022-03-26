/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const Type_partie = sequelize.define('type_partie', {
    id_type_partie: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    libelle: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'type_partie'
  });
  return Type_partie;
};
