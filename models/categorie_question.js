/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const Categorie_question = sequelize.define('categorie_question', {
    id_categorie_question: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    libelle: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'categorie_question'
  });
  return Categorie_question;
};
