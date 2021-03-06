/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const Question = sequelize.define('question', {
    id_question: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    intitule: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rep_1: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rep_2: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rep_3: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rep_4: {
      type: DataTypes.STRING,
      allowNull: false
    },
    reponse: {
      type: DataTypes.STRING,
      allowNull: false
    },
    id_categorie_question: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'categorie_question',
        key: 'id_categorie_question'
      }
    },
    difficultÃ©: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    commentaire: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'question'
  });
  return Question;
};
