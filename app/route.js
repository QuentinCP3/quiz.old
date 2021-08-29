module.exports = function(app, passport,db,io,ent,con,session) {

const {AMCP} = require('casparcg-connection');
var sleepms = require('sleep-ms');
const { getLyrics, getSong } = require('genius-lyrics-api');
const jwt = require('jsonwebtoken');

var sess;

// const Timer = require("easytimer.js");
var Timer = require('easytimer');
var net = require('net');
var timers=new Array();

SetTimerArray(db);



    // =====================================
    // Page d'accueil ========
    // =====================================
    app.get('/', function(req, res) {
      res.render('login.ejs', { message: req.flash('loginMessage') });
      sess = req.session;
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // Affiche le formulaire de connexion
    app.get('/login', function(req, res) {
      res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    app.post('/login', passport.authenticate('local-login', {
	        successRedirect : '/home', // Page succes de login
	        failureRedirect : '/login', // Page en cas d'erreur
	        failureFlash : true
       }));

    // =====================================
    // Enregistrement=======================
    // =====================================
    // Formulaire D'enregistrement
    app.get('/signup', function(req, res) {
      res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    app.post('/signup', passport.authenticate('local-signup', {
      successRedirect : '/profile',
      failureRedirect : '/signup',
      failureFlash : true
    }));

    /*app.post(
      '/signup',
      passport.authenticate('local-signup', { successRedirect : '/profile',
                                              failureRedirect : '/signup',
                                              failureFlash : true}),
      async (req, res, next) => {
        res.json({
          message: 'Signup successful',
          user: req.user
        });
      }
    );*/
    // =====================================
    // PROFILE         =====================
    // =====================================

    app.get('/profile', isLoggedIn, function(req, res) {
    	res.render('profile.ejs', {
        user : req.user
      });
    });


    // =========================================================================
    // Accueil du quiz    ======================================================
    // =========================================================================

    app.get('/home',isLoggedIn,function(req,res){
    	// db.match.findAll({include:[db.sport]}).then(function(matchs){
      console.log(req.user.email);
      sess.email = req.user.email;
      console.log(sess.email);
      sess.idsession = req.user.id;
      console.log(req.user.id);
       var moment = require('moment');
        moment.locale('fr');
        res.render('home.ejs', {
          user : req.user, idsession : sess.idsession
        });
      });

      // =========================================================================
      // Jouer : liste des différents modes de jeu    ============================
      // =========================================================================

      app.get('/jouer',isLoggedIn,function(req,res){
      	// db.match.findAll({include:[db.sport]}).then(function(matchs){
         var moment = require('moment');
          moment.locale('fr');
          res.render('jouer.ejs', {
            user : req.user
          });
        });

        // =========================================================================
        // Ajout de questions    ===================================================
        // =========================================================================

        app.get('/addQuestion',isLoggedIn,function(req,res){
        	// db.match.findAll({include:[db.sport]}).then(function(matchs){
           var moment = require('moment');
            moment.locale('fr');
            res.render('addQuestion.ejs', {
              user : req.user
            });
          });

          // =========================================================================
          // Ajout de questions : traitement    ======================================
          // =========================================================================

          app.post('/addQuestion',isLoggedIn,function(req,res){
            // db.match.findAll({include:[db.sport]}).then(function(matchs){
            console.log(req.body);
            db.question.create({
              intitule:req.body.question,
              rep_1:req.body.repA,
              rep_2:req.body.repB,
              rep_3:req.body.repC,
              rep_4:req.body.repD,
              reponse:req.body.bonneRep,
              id_categorie_question:req.body.categorie,
              difficulté:req.body.difficulte,
              commentaire:req.body.commentaire
            }).then(function() {
              var moment = require('moment');
                moment.locale('fr');
                res.redirect('/addQuestion');
            });
          });

        // =========================================================================
        // Règles : affichages des différentes règles    ===========================
        // =========================================================================

        app.get('/rules',isLoggedIn,function(req,res){
          // db.match.findAll({include:[db.sport]}).then(function(matchs){
           var moment = require('moment');
            moment.locale('fr');
            res.render('rules.ejs', {
              user : req.user
            });
          });

          // =========================================================================
          // Stats : affichages des différentes stats du joueur    ===================
          // =========================================================================

          app.get('/stats',isLoggedIn,function(req,res){
            // db.match.findAll({include:[db.sport]}).then(function(matchs){
             var moment = require('moment');
              moment.locale('fr');
              db.stats.findOne({
                where:{
                  id_membre:req.user.id
              }}).then(function(stats) {
                res.render('stats.ejs', {
                  user : req.user, stats : stats
                });
              });
            });

        // =========================================================================
        // Jouer : mode classique    ===============================================
        // =========================================================================

        app.get('/jouer/classique',isLoggedIn,function(req,res){
          var nJoueur;
        	// db.match.findAll({include:[db.sport]}).then(function(matchs){
          db.sequelize.query('SELECT partie_accueille.id_membre, partie_accueille.id_partie, partie_accueille.n_joueur FROM partie_accueille RIGHT JOIN partie ON partie.id_partie = partie_accueille.id_partie WHERE partie_accueille.id_type_partie = 1 ORDER BY partie_accueille.id_partie DESC, partie_accueille.n_joueur DESC LIMIT 1',{type:db.sequelize.QueryTypes.SELECT}).then(function(partie){
            var moment = require('moment');
            moment.locale('fr');
            console.log('PARTIE');
            console.log(partie);
            console.log(partie[0].n_joueur);
            console.log('----- LENGTH -------');
            console.log(partie.length);
            if (partie[0].n_joueur < 4) {
              db.partie_accueille.create({                                            // Ajout de joueur dans la partie si nombre de joueurs < 4
                id_membre: req.user.id,
                id_partie: partie[0].id_partie,
                id_type_partie: 1,
                n_joueur: partie[0].n_joueur + 1,
                score: 0
              }).then(function() {
                sess.idpartie = partie[0].id_partie;
                nJoueur = partie[0].n_joueur + 1;
                if (nJoueur == 4) {
                  db.sequelize.query("(SELECT id_question FROM question WHERE difficulté = 1 AND id_categorie_question != 11 ORDER BY RAND() LIMIT 2) UNION (SELECT id_question FROM question WHERE difficulté = 2 AND id_categorie_question != 11 ORDER BY RAND() LIMIT 2) UNION (SELECT id_question FROM question WHERE difficulté = 3 AND id_categorie_question != 11 ORDER BY RAND() LIMIT 2) UNION (SELECT id_question FROM question WHERE difficulté = 4 AND id_categorie_question != 11 ORDER BY RAND() LIMIT 2) UNION (SELECT id_question FROM question WHERE difficulté = 5 AND id_categorie_question != 11 ORDER BY RAND() LIMIT 2)",{type:db.sequelize.QueryTypes.SELECT}).then(function(questions){
                    console.log("Questions");
                    console.log(questions);
                    for (var i=0; i < 10; i++) {
                      var num = i + 1;
                      db.pose.create({
                        id_partie:sess.idpartie,
                        id_question:questions[i].id_question,
                        n_question:num
                      });
                    }
                  });
                }
              }).then(function() {
                var erreur = "none";
                res.render('../views/mode/classique.ejs',{partie:partie,moment:moment, erreur: erreur, user: req.user, nombre_joueurs : nJoueur})
              });
          	} else {
              db.sequelize.query('SELECT MAX(id_partie) AS id_partie_max FROM partie',{type:db.sequelize.QueryTypes.SELECT}).then(function(id_partie_max){
                partie[0].id_partie = id_partie_max[0].id_partie_max + 1;
                console.log(id_partie_max[0].id_partie_max);
                db.partie.create({
                  id_partie: partie[0].id_partie                          // Création de la partie si nombre de joueurs dans la dernière partie = 4
                }).then(function() {
                  db.partie_accueille.create({                            // Ajout de joueur dans la partie
                    id_membre: req.user.id,
                    id_partie: partie[0].id_partie,
                    id_type_partie: 1,
                    n_joueur: 1,
                    score: 0
                  }).then(function() {
                    sess.idpartie = partie[0].id_partie;
                    nJoueur = 1;
                    console.log(nJoueur);
                    console.log('------------------');
                    console.log("render");
                    console.log(req.user['name']);
                    var erreur = "none";
                    res.render('../views/mode/classique.ejs',{partie:partie,moment:moment, erreur: erreur, user: req.user, nombre_joueurs : nJoueur})
                  });
                });
              });
          	}
          });
        });

        app.get('/jouer/eminem',isLoggedIn,function(req,res){
          var nJoueur;
          db.sequelize.query('SELECT partie_accueille.id_membre, partie_accueille.id_partie, partie_accueille.n_joueur FROM partie_accueille RIGHT JOIN partie ON partie.id_partie = partie_accueille.id_partie WHERE partie_accueille.id_type_partie = 2 ORDER BY partie_accueille.id_partie DESC, partie_accueille.n_joueur DESC LIMIT 1',{type:db.sequelize.QueryTypes.SELECT}).then(function(partie){
            var moment = require('moment');
            moment.locale('fr');
            console.log('PARTIE');
            console.log(partie);
            console.log(partie[0].n_joueur);
            console.log('----- LENGTH -------');
            console.log(partie.length);
            if (partie[0].n_joueur < 4) {
              db.partie_accueille.create({                                            // Ajout de joueur dans la partie si nombre de joueurs < 4
                id_membre: req.user.id,
                id_partie: partie[0].id_partie,
                id_type_partie: 2,
                n_joueur: partie[0].n_joueur + 1,
                score: 0
              }).then(function() {
                sess.idpartie = partie[0].id_partie;
                nJoueur = partie[0].n_joueur + 1;
                if (nJoueur == 4) {
                  var numberOfLines = 15;
                  for (var numberOfTracks = 0; numberOfTracks < 12; numberOfTracks++) {
                    db.sequelize.query("SELECT * FROM eminem",{type:db.sequelize.QueryTypes.SELECT}).then(function(track){
                      var rTrack = Math.floor(Math.random() * (track.length));
                      console.log(track[rTrack].titre);
                      const options = {
                        apiKey: 'f89a8lUkXO6zqLEYb6U5xZUFKDOm3OJ5-1tum6isKaSQxuLT76CH7-UBKgRXqTsH',
                        title: track[rTrack].titre,
                        artist: track[rTrack].artiste,
                        optimizeQuery: true
                      };

                      getSong(options).then(function(song) {
                        /*console.log(`
                        ${song.id}
                        ${song.url}
                        ${song.albumArt}
                        ${song.lyrics}`);*/
                        var lines = song.lyrics.split(/\r\n|\r|\n/);
                        var r = Math.floor(Math.random() * (lines.length - numberOfLines));
                        var s = r;
                        var line = "";
                        var t = 0;
                        while (r <= s+numberOfLines) {
                          if (lines[r] != "") {
                            if (r == s+numberOfLines) {
                              t++;
                              line = line + lines[r];
                            } else {
                              t++;
                              line = line + lines[r]+"<br/>";
                            }
                          } else {
                            s++;
                          }
                          r++;
                        }
                        //console.log(song.url);
                        //console.log(line);
                        db.sequelize.query('SELECT * FROM eminem AS t1 JOIN (SELECT id FROM eminem EXCEPT SELECT id FROM eminem WHERE titre = "'+track[rTrack].titre+'" ORDER BY RAND() LIMIT 3) as t2 ON t1.id=t2.id',{type:db.sequelize.QueryTypes.SELECT}).then(function(responseTrack){
                          var reponses = new Array();
                          reponses[0] = track[rTrack].titre;
                          reponses[1] = responseTrack[0].titre;
                          reponses[2] = responseTrack[1].titre;
                          reponses[3] = responseTrack[2].titre;
                          var i, j, tmp;
                          for (i = reponses.length - 1; i > 0; i--) {
                              j = Math.floor(Math.random() * (i + 1));
                              tmp = reponses[i];
                              reponses[i] = reponses[j];
                              reponses[j] = tmp;
                          }
                          var difficulte;
                          console.log(numberOfLines);
                          if (numberOfLines >= 13) {
                            difficulte = 1;
                          } else if (numberOfLines <= 12 && numberOfLines > 9) {
                            difficulte = 2;
                          } else if (numberOfLines <= 9 && numberOfLines > 7) {
                            difficulte = 3;
                          } else if (numberOfLines <= 7 && numberOfLines > 4) {
                            difficulte = 4;
                          } else if (numberOfLines <= 4 && numberOfLines > 2) {
                            difficulte = 5;
                          }
                          var commentaire = track[rTrack].titre + " - " + track[rTrack].artiste + " " + track[rTrack].feat + "<br/>" + track[rTrack].album;
                          db.question.create({
                            intitule:line,
                            rep_1:reponses[0],
                            rep_2:reponses[1],
                            rep_3:reponses[2],
                            rep_4:reponses[3],
                            reponse:track[rTrack].titre,
                            id_categorie_question:11,
                            difficulté:difficulte,
                            commentaire:commentaire
                          }).then(function(question) {
                            db.pose.create({
                              id_partie:sess.idpartie,
                              id_question:question.id_question,
                              n_question:numberOfTracks
                            });
                          });
                        });
                        numberOfLines--;
                        //console.log(song.lyrics);
                      });
                    });
                  }
                }
              }).then(function() {
                var erreur = "none";
                res.render('../views/mode/eminem.ejs',{partie:partie,moment:moment, erreur: erreur, user: req.user, nombre_joueurs : nJoueur})
              });
          	} else {
              db.sequelize.query('SELECT MAX(id_partie) AS id_partie_max FROM partie',{type:db.sequelize.QueryTypes.SELECT}).then(function(id_partie_max){
                partie[0].id_partie = id_partie_max[0].id_partie_max + 1;
                console.log(id_partie_max[0].id_partie_max);
                db.partie.create({
                  id_partie: partie[0].id_partie                          // Création de la partie si nombre de joueurs dans la dernière partie = 4
                }).then(function() {
                  db.partie_accueille.create({                                            // Ajout de joueur dans la partie
                    id_membre: req.user.id,
                    id_partie: partie[0].id_partie,
                    id_type_partie: 2,
                    n_joueur: 1,
                    score: 0
                  }).then(function() {
                    sess.idpartie = partie[0].id_partie;
                    nJoueur = 1;
                    console.log(nJoueur);
                    console.log('------------------');
                    console.log("render");
                    console.log(req.user['name']);
                    var erreur = "none";
                    res.render('../views/mode/eminem.ejs',{partie:partie,moment:moment, erreur: erreur, user: req.user, nombre_joueurs : nJoueur})
                  });
                });
              });
          	}
          });
        });

    // =========================================================================
    // Page de déconnexion      ==================================================
    // =========================================================================
    // =====================================
    app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
    });


    // =========================================================================
    // Gestion des exception      ==================================================
    // =========================================================================

    process.on('unhandledRejection', error => {
  // Affichera "unhandledRejection err is not defined"
  console.log('unhandledRejection', error);
});




    // =========================================================================
    // Gestion du socket      ==================================================
    // =========================================================================

    io.sockets.on('connection', function (socket, pseudo) {

      var timer=new Array();  // Timer d'avant partie
      var timerQuestion=new Array();  // Timer de question
      var timeQuestion=new Array();   // Objet Timer()
      var indTimerQuestion = 0;
      var executed = new Array();

    // =========================================================================
    // Gestion des salons de connexions      ===================================
    // =========================================================================
    socket.on('switchRoom', function(newroom){
      if (socket.room != newroom.room) {
        socket.leave(socket.room);
        socket.join(newroom.room);
        socket.room = newroom.room;
        if (newroom.room!= null) {
          socket.param = newroom.room;
        }
      }
    });

    // =========================================================================
    // Récupération de la liste des joueurs d'une partie     ===================
    // =========================================================================

    socket.on('listJoueurs', function(id_partie, nombre_joueurs) {
      db.sequelize.query('SELECT user.nom, partie_accueille.score, partie_accueille.id_partie, partie_accueille.n_joueur FROM partie_accueille INNER JOIN user ON user.id = partie_accueille.id_membre WHERE partie_accueille.id_partie = '+id_partie,{type:db.sequelize.QueryTypes.SELECT}).then(function(membres){
        console.log(membres);
        nombre_joueurs = membres[nombre_joueurs-1].n_joueur;
        console.log('NUMERO JOUEUR '+membres[nombre_joueurs-1].n_joueur);
        socket.emit('displayJoueurs', membres, nombre_joueurs);
      });
    });

    // =========================================================================
    // Chronomètre pré-game     ================================================
    // =========================================================================

    var timer = new Array();
    socket.on('timerPreGame', function(id_partie) {
      var timerMode = "preGame";
      timer[id_partie] = new Timer();
      timer[id_partie].start({countdown: true, precision: 'secondTenths', startValues: {seconds: 3}});
      timer[id_partie].addEventListener('secondTenthsUpdated', () => {
        var chrono = timer[id_partie].getTimeValues().seconds.toString();
        var chronoTenths = timer[id_partie].getTimeValues().seconds.toString()+timer[id_partie].getTimeValues().secondTenths.toString();
        console.log(chrono);
        socket.emit('displayTimer', chrono, chronoTenths, timerMode);
      });
    });

    // =========================================================================
    // Récupération des questions     ==========================================
    // =========================================================================

    socket.on('getQuestionsId', function(id_partie) {
      db.sequelize.query("SELECT id_question FROM pose WHERE id_partie = "+id_partie,{type:db.sequelize.QueryTypes.SELECT}).then(function(questions){
        console.log(questions);
        for (var i=0; i < 10; i++) {
          var id_question = questions[i]['id_question'];
          var num = i + 1;
          if (i == 9) {
            socket.emit('questions', questions);
          }
        }
      });
    });

    // =========================================================================
    // Récupération de la question n     =======================================
    // =========================================================================

    socket.on('getQuestion', function(id_question) {
      console.log(id_question);
      db.question.findOne({
        where:{
          id_question:id_question
      }}).then(function(question){
        console.log(question);
        socket.emit('displayQuestion',question);
      });
    });

    // =========================================================================
    // Chronomètre question     ================================================
    // =========================================================================

    var timerQuestion = new Array();
    socket.on('timerQuestion', function(id_partie, id_question) {
      var timerMode = "question";
      timer[id_partie] = new Timer();
      timer[id_partie].start({countdown: true, precision: 'secondTenths', startValues: {seconds: 15}});
      timer[id_partie].addEventListener('secondTenthsUpdated', () => {
        var chrono = timer[id_partie].getTimeValues().seconds.toString();
        var chronoTenths = timer[id_partie].getTimeValues().seconds.toString()+timer[id_partie].getTimeValues().secondTenths.toString();
        console.log(chrono);
        socket.emit('displayTimerQuestion', chrono, chronoTenths, timerMode);
      });
    });

    // =========================================================================
    // Méthode avec clic sur une reponse     ===================================
    // =========================================================================

    socket.on('reponse', function(id_partie, idQuestion, chronometre, repNumber, numero_joueur, questionNumber, reponse, userId) {
      var points = 0;
      console.log(id_partie);
      console.log(idQuestion);
      console.log(chronometre);
      console.log(repNumber);
      console.log(numero_joueur);
      console.log(questionNumber);
      console.log(reponse);
      console.log(userId);
      db.question.findOne({
        where: {
          reponse: reponse,
          id_question: idQuestion
        }
      }).then(function(result) {
        if (result != null) {
          console.log("RESULT != NULL");
          console.log(result);
          if (result.reponse == reponse) {
            if (questionNumber == 1 || questionNumber == 2) {
              points = 500 * chronometre/150 + 500;
            } else if (questionNumber == 3 || questionNumber == 4) {
              points = 750 * chronometre/150 + 750;
            } else if (questionNumber == 5 || questionNumber == 6) {
              points = 1000 * chronometre/150 + 1000;
            } else if (questionNumber == 7 || questionNumber == 8) {
              points = 1250 * chronometre/150 + 1250;
            } else if (questionNumber == 9 || questionNumber == 10) {
              points = 1500 * chronometre/150 + 1500;
            }
            console.log("POINTS : "+points);
            console.log("CATEGORIE : "+result.id_categorie_question);
            db.stats.findOne({
              where: {
                id_membre: userId
              }
            }).then(function(stats_joueur) {
              db.stats.update({
                nbre_bonnes_rep: stats_joueur.nbre_bonnes_rep+1
                },{ where: {
                  id_membre: userId
                }
              }).then(function() {
                if (result.id_categorie_question == 1) {
                  db.stats.update({
                    bonnes_rep_sports: stats_joueur.bonnes_rep_sports + 1
                    },{ where: {
                      id_membre: userId
                    }
                  })
                } else if (result.id_categorie_question == 2) {
                  db.stats.update({
                    bonnes_rep_art_litte: stats_joueur.bonnes_rep_art_litte + 1
                    },{ where: {
                      id_membre: userId
                    }
                  })
                } else if (result.id_categorie_question == 3) {
                  db.stats.update({
                    bonnes_rep_cine_serie: stats_joueur.bonnes_rep_cine_serie + 1
                    },{ where: {
                      id_membre: userId
                    }
                  })
                } else if (result.id_categorie_question == 4) {
                  db.stats.update({
                    bonnes_rep_musique: stats_joueur.bonnes_rep_musique + 1
                    },{ where: {
                      id_membre: userId
                    }
                  })
                } else if (result.id_categorie_question == 5) {
                  db.stats.update({
                    bonnes_rep_histoire: stats_joueur.bonnes_rep_histoire + 1
                    },{ where: {
                      id_membre: userId
                    }
                  })
                } else if (result.id_categorie_question == 6) {
                  db.stats.update({
                    bonnes_rep_geo: stats_joueur.bonnes_rep_geo + 1
                    },{ where: {
                      id_membre: userId
                    }
                  })
                } else if (result.id_categorie_question == 7) {
                  db.stats.update({
                    bonnes_rep_sciences_nat: stats_joueur.bonnes_rep_sciences_nat + 1
                    },{ where: {
                      id_membre: userId
                    }
                  })
                } else if (result.id_categorie_question == 8) {
                  db.stats.update({
                    bonnes_rep_techno: stats_joueur.bonnes_rep_techno + 1
                    },{ where: {
                      id_membre: userId
                    }
                  })
                } else if (result.id_categorie_question == 9) {
                  db.stats.update({
                    bonnes_rep_eco_societe: stats_joueur.bonnes_rep_eco_societe + 1
                    },{ where: {
                      id_membre: userId
                    }
                  })
                }
              });
              db.partie_accueille.findOne({
                where: {
                  n_joueur: numero_joueur,
                  id_partie: id_partie
                }
              }).then(function(partieAccueille) {
                var score = partieAccueille.score + points;
                db.partie_accueille.update({
                  score: score
                },
                  { where: {
                    n_joueur: numero_joueur,
                    id_partie: id_partie
                  }
                }).then(function() {
                  if (numero_joueur == 1) {
                    db.pose.update({
                      pts_joueur_1: points
                    },
                      { where: {
                        id_partie: id_partie,
                        id_question: idQuestion
                      }
                    });
                  } else if (numero_joueur == 2) {
                    db.pose.update({
                      pts_joueur_2: points
                    },
                      { where: {
                        id_partie: id_partie,
                        id_question: idQuestion
                      }
                    });
                  } else if (numero_joueur == 3) {
                    db.pose.update({
                      pts_joueur_3: points
                    },
                      { where: {
                        id_partie: id_partie,
                        id_question: idQuestion
                      }
                    });
                  } else if (numero_joueur == 4) {
                    db.pose.update({
                      pts_joueur_4: points
                    },
                      { where: {
                        id_partie: id_partie,
                        id_question: idQuestion
                      }
                    });
                  }
                }).then(function() {
                  var resultat = true;
                  socket.emit('treat_answer', repNumber, resultat, points, reponse, result.reponse);
                });
              });
            });
          }
        } else {
          db.question.findOne({
            where: {id_question: idQuestion}
          }).then(function(question_erreur) {
            console.log(question_erreur);
            db.stats.findOne({
              where: {id_membre: userId}
            }).then(function(stats_joueur){
              db.stats.update(
                {nbre_mauvaises_rep: stats_joueur.nbre_mauvaises_rep + 1},
                { where: {
                  id_membre: userId
                }
              }).then(function() {
                if (question_erreur.id_categorie_question == 1) {
                  db.stats.update(
                    {mauvaises_rep_sports: stats_joueur.mauvaises_rep_sports + 1},
                     { where: {
                      id_membre: userId}
                     }
                  );
                } else if (question_erreur.id_categorie_question == 2) {
                  db.stats.update(
                    {mauvaises_rep_art_litte: stats_joueur.mauvaises_rep_art_litte + 1},
                     { where: {
                      id_membre: userId}
                     }
                  );
                } else if (question_erreur.id_categorie_question == 3) {
                  db.stats.update(
                    {mauvaises_rep_cine_series: stats_joueur.mauvaises_rep_cine_series + 1},
                     { where: {
                      id_membre: userId}
                     }
                  );
                } else if (question_erreur.id_categorie_question == 4) {
                  db.stats.update(
                    {mauvaises_rep_musique: stats_joueur.mauvaises_rep_musique + 1},
                     { where: {
                      id_membre: userId}
                     }
                  );
                } else if (question_erreur.id_categorie_question == 5) {
                  db.stats.update(
                    {mauvaises_rep_histoire: stats_joueur.mauvaises_rep_histoire + 1},
                     { where: {
                      id_membre: userId}
                     }
                  );
                } else if (question_erreur.id_categorie_question == 6) {
                  db.stats.update(
                    {mauvaises_rep_geo: stats_joueur.mauvaises_rep_geo + 1},
                     { where: {
                      id_membre: userId}
                     }
                  );
                } else if (question_erreur.id_categorie_question == 7) {
                  db.stats.update(
                    {mauvaises_rep_sciences_nat: stats_joueur.mauvaises_rep_sciences_nat + 1},
                     { where: {
                      id_membre: userId}
                     }
                  );
                } else if (question_erreur.id_categorie_question == 8) {
                  db.stats.update(
                    {mauvaises_rep_techno: stats_joueur.mauvaises_rep_techno + 1},
                     { where: {
                      id_membre: userId}
                     }
                  );
                } else if (question_erreur.id_categorie_question == 9) {
                  db.stats.update(
                    {mauvaises_rep_eco_societe: stats_joueur.mauvaises_rep_eco_societe + 1},
                     { where: {
                      id_membre: userId}
                     }
                  );
                }
                var resultat = false;
                socket.emit('treat_answer', repNumber, resultat, points, reponse, question_erreur.reponse);
              });
            });
          });
        }
      });
    });

    // =========================================================================
    // Méthode sans clic sur une reponse     ===================================
    // =========================================================================

    socket.on('no_reponse', function(id_partie, idQuestion, repNumber, numero_joueur, questionNumber, userId) {
      var points = 0;
      console.log(id_partie);
      console.log(idQuestion);
      console.log(repNumber);
      console.log(numero_joueur);
      console.log(questionNumber);
      console.log(userId);
      db.question.findOne({
        where: {id_question: idQuestion}
      }).then(function(question) {
        db.stats.findOne({
          where: {id_membre: userId}
        }).then(function(stats_joueur){
          db.stats.update(
            {nbre_mauvaises_rep: stats_joueur.nbre_mauvaises_rep + 1},
            { where: {
              id_membre: userId
            }
          }).then(function() {
            if (question.id_categorie_question == 1) {
              db.stats.update(
                {mauvaises_rep_sports: stats_joueur.mauvaises_rep_sports + 1},
                 { where: {
                  id_membre: userId}
                 }
              );
            } else if (question.id_categorie_question == 2) {
              db.stats.update(
                {mauvaises_rep_art_litte: stats_joueur.mauvaises_rep_art_litte + 1},
                 { where: {
                  id_membre: userId}
                 }
              );
            } else if (question.id_categorie_question == 3) {
              db.stats.update(
                {mauvaises_rep_cine_series: stats_joueur.mauvaises_rep_cine_series + 1},
                 { where: {
                  id_membre: userId}
                 }
              );
            } else if (question.id_categorie_question == 4) {
              db.stats.update(
                {mauvaises_rep_musique: stats_joueur.mauvaises_rep_musique + 1},
                 { where: {
                  id_membre: userId}
                 }
              );
            } else if (question.id_categorie_question == 5) {
              db.stats.update(
                {mauvaises_rep_histoire: stats_joueur.mauvaises_rep_histoire + 1},
                 { where: {
                  id_membre: userId}
                 }
              );
            } else if (question.id_categorie_question == 6) {
              db.stats.update(
                {mauvaises_rep_geo: stats_joueur.mauvaises_rep_geo + 1},
                 { where: {
                  id_membre: userId}
                 }
              );
            } else if (question.id_categorie_question == 7) {
              db.stats.update(
                {mauvaises_rep_sciences_nat: stats_joueur.mauvaises_rep_sciences_nat + 1},
                 { where: {
                  id_membre: userId}
                 }
              );
            } else if (question.id_categorie_question == 8) {
              db.stats.update(
                {mauvaises_rep_techno: stats_joueur.mauvaises_rep_techno + 1},
                 { where: {
                  id_membre: userId}
                 }
              );
            } else if (question.id_categorie_question == 9) {
              db.stats.update(
                {mauvaises_rep_eco_societe: stats_joueur.mauvaises_rep_eco_societe + 1},
                 { where: {
                  id_membre: userId}
                 }
              );
            }
            var resultat = false;
            socket.emit('treat_answer', repNumber, resultat, points, repNumber, question.reponse);
          });
        });
      });
    });

    // =========================================================================
    // Obtention du rang du joueur à la fin de la partie     ===================
    // =========================================================================

    socket.on('Get_rank', function(numJoueur, id_partie) {
      db.sequelize.query('SELECT id_membre, n_joueur, score FROM partie_accueille AS partieAccueille JOIN (SELECT @curRow := 0) r WHERE id_partie = '+id_partie+' ORDER BY score DESC',{type:db.sequelize.QueryTypes.SELECT}).then(function(partieAccueille) {
        socket.emit('Display_rank',numJoueur,id_partie,partieAccueille);
      });
    });


    // =========================================================================
    // Méthode lancement d'un chrono avec temps max (target)     ===============
    // =========================================================================

    socket.on('Start_chrono',function(match,target){
      var target = parseInt(target,10);
       con.infoServer().then(function(res){
         console.log(res);
         socket.emit('test',{res:res});
       });
      if (timers[match].isRunning()) {
        console.log("Le chrono est deja lancé");
      }else{
        if (timers[match].first==true) {
          timers[match].start({precision: 'seconds', target: {minutes: target}});
          timers[match].first = false;
          timers[match].addEventListener('secondsUpdated', () => {
            minutes= timers[match].getTotalTimeValues().minutes;
            secondes=timers[match].getTimeValues().seconds;
            if(minutes < 10)
            {
              minutes = "0"+minutes;
            }
            if(secondes < 10)
            {
              secondes="0"+secondes;
            }
            timeInminutes = minutes+':'+secondes;
            var affBtnStartPause = "pause";
            socket.emit('chrono',{match:match,chrono:timeInminutes.toString(),affBtnStartPause:affBtnStartPause});
            socket.broadcast.to(socket.room).emit('chrono',{match:match,chrono:timeInminutes.toString(),affBtnStartPause:affBtnStartPause});
          });
        }else{
          timers[match].start({precision: 'seconds', target: {minutes: target}});
        }
      }
    });


    // =========================================================================
    // Méthode lancement d'un chrono avec compte a rebours(target)     ===============
    // =========================================================================

    socket.on('Start_chrono_countdown',function(match,target){
      var target = parseInt(target,10);
       con.infoServer().then(function(res){
         console.log(res);
         socket.emit('test',{res:res});
       });
      if (timers[match].isRunning()) {
        console.log("Le chrono est deja lancé");
      }else{
        if (timers[match].first==true) {
          timers[match].start({countdown: true,precision: 'seconds', startValues: {minutes: target}});
          timers[match].first = false;
          timers[match].addEventListener('secondsUpdated', () => {
            minutes= timers[match].getTotalTimeValues().minutes;
            secondes=timers[match].getTimeValues().seconds;
            if(minutes < 10)
            {
              minutes = "0"+minutes;
            }
            if(secondes < 10)
            {
              secondes="0"+secondes;
            }
            timeInminutes = minutes+':'+secondes;
            var affBtnStartPause = "pause";
            socket.emit('chrono',{match:match,chrono:timeInminutes.toString(),affBtnStartPause:affBtnStartPause});
            socket.broadcast.to(socket.room).emit('chrono',{match:match,chrono:timeInminutes.toString(),affBtnStartPause:affBtnStartPause});

          });
        }else{
          timers[match].start({countdown: true,precision: 'seconds', startValues: {minutes: target}});
        }
      }
    });

    // =======================================================================================
    // Méthode lancement d'un chrono avec temps max (target)  et temps départ  ===============
    // =======================================================================================

    socket.on('Load_chrono',function(match,min,sec,target){
      var min = parseInt(min,10);
      var sec = parseInt(sec,10);
      var target= parseInt(target,10);
      console.log(match,min,sec,target);
      if (timers[match].isRunning()) {
        console.log("Le chrono est deja lancé");
      }else{
        if (timers[match].first==true) {
          timers[match].start({startValues: {minutes: min, seconds: sec}, target: {minutes: target}});
          timers[match].first = false;
          timers[match].addEventListener('secondsUpdated', () => {
            minutes= timers[match].getTotalTimeValues().minutes;
            secondes=timers[match].getTimeValues().seconds;
            if(minutes < 10)
            {
              minutes = "0"+minutes;
            }
            if(secondes < 10)
            {
              secondes="0"+secondes;
            }
            timeInminutes = minutes+':'+secondes;
            var affBtnStartPause = "pause";
            socket.emit('chrono',{match:match,chrono:timeInminutes.toString(),affBtnStartPause:affBtnStartPause});
            socket.broadcast.to(socket.room).emit('chrono',{match:match,chrono:timeInminutes.toString(),affBtnStartPause:affBtnStartPause});

          });
        }else{
          timers[match].start({startValues: {minutes: min, seconds: sec}, target: {minutes: target}});
        }
      }
    });


    // =========================================================================
    // Méthode de pause d'un chrono ============================================
    // =========================================================================

    socket.on('Pause_chrono',function(match){
      if ( typeof timers[match]=='object') {
        console.log('pause');
        timers[match].pause();
        minutes= timers[match].getTotalTimeValues().minutes;
        secondes=timers[match].getTimeValues().seconds;
        if(minutes < 10)
        {
          minutes = "0"+minutes;
        }
        if(secondes < 10)
        {
          secondes="0"+secondes;
        }
        timeInminutes = minutes+':'+secondes;
        var affBtnStartPause = "start";
        console.log(timeInminutes);
        socket.emit('chrono',{match:match,chrono:timeInminutes.toString(),affBtnStartPause:affBtnStartPause});
        socket.broadcast.to(socket.room).emit('chrono',{match:match,chrono:timeInminutes.toString(),affBtnStartPause:affBtnStartPause});


      }
    });



    // =========================================================================
    // Méthode d'arret d'un chrono avec remise a zero            ===============
    // =========================================================================

    socket.on('Stop_chrono',function(match){
      if ( typeof timers[match]=='object') {
        timers[match].stop();
        console.log('stop');
        timeInminutes = timers[match].getTimeValues().minutes +':'+timers[match].getTimeValues().seconds;
        var affBtnStartPause = "start";
        console.log(timeInminutes);
        socket.emit('chrono',{match:match,chrono:timeInminutes.toString(),affBtnStartPause:affBtnStartPause});
        socket.broadcast.to(socket.room).emit('chrono',{match:match,chrono:timeInminutes.toString(),affBtnStartPause:affBtnStartPause});
      }
    });

  });


    // =========================================================================
    // Méthode de creation des chronometres                       ===============
    // =========================================================================

    function SetTimerArray(db)
    {
      db.partie.findAll().then(function(parties){
        parties.forEach(function(partie){
          var time = new Timer();
          var name = partie.id_partie;
          timers[name] = time;
          timers[name].first = true ;
        });
      });
    }
  };

    // =========================================================================
    // Méthode de verification du login                          ===============
    // =========================================================================

    function isLoggedIn(req, res, next) {
      if (req.isAuthenticated()){
        return next();
      }
      res.redirect('/');
    }

    // =========================================================================
    // Méthode de split avec plusieurs delimiters                ===============
    // =========================================================================

    function splitMulti(str, tokens){
      var tempChar = tokens[0];
      for(var i = 1; i < tokens.length; i++){
        str = str.split(tokens[i]).join(tempChar);
      }
      str = str.split(tempChar);
      return str;
    }

    // =========================================================================
    // Méthode de vérification que l'argument est bien de type date     ========
    // =========================================================================

    function returnDate(i) {
      console.log(typeof i);
      if(i != '') {
        return i;
      }
    }
    // =========================================================================
    // Méthode de vérification que l'argument est bien de type entier   ========
    // =========================================================================

    function returnNumber(i) {
      var val = parseInt(i,10);
      if(String(val) != 'NaN') {
        return val;
      }
    }


     // =========================================================================
    // Méthode de vérification que l'argument est bien de type float   ========
    // =========================================================================

    function returnFloat(i) {
      var val = parseFloat(i,10);
      if(String(val) != 'NaN') {
        return val;
      }
    }
