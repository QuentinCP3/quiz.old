// config/passport.js

// Chargement des elements nécessaires
var LocalStrategy   = require('passport-local').Strategy;
var db           = require('../models/');
var User = db.user;
var Stat = db.stats;
var bCrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJWT = require('passport-jwt').ExtractJwt;
module.exports = function(passport) {

    // =========================================================================
    // PASSPORT SESSION       ==================================================
    // =========================================================================
    // Parametrages de session d'un utilisateur
    passport.serializeUser(function(user, done) {
        console.log('serialize');
        done(null, user.id);
    });

    // Deserialisation d'un utilisateur
    passport.deserializeUser(function(id, done) {
        User.findById(id).then(function(user) {
            if (user) {
                done(null, user.get());
            } else {
                done(user.errors, null);
            }
        });
    });
    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // Stratégie définissant l'enregistrement d'un utilisateur

    passport.use('local-signup', new LocalStrategy({
        usernameField : 'nom',
        passwordField : 'pass',
        passReqToCallback : true
    },
    function(req, nom, password, done) {
        // asynchrone
        process.nextTick(function() {
           User.findOne({ where: {nom: nom} }).then(res => {
            //Si un utilisateur existe deja avec ce nom
            if (res) {
                return done(null, false, req.flash('signupMessage', 'Compte bien créé'));
            } else {
                User.create({ nom : nom ,pass: User.generateHash(password),email:req.body.email, date_naissance:req.body.date_naissance, date_inscription:Date(), parties_gratuites:5, points:0}).then(res => {
                  Stat.create({ id_membre: res.id}).then(stat => {
                   return done(null,res);
                 });
               });
            }
        });
       });
    }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // Stratégie de login en local

    passport.use('local-login', new LocalStrategy(

    {
        usernameField: 'nom',
        passwordField: 'password',
        passReqToCallback: true

    },
    function(req, nom, password, done) {
        var isValidPassword = function(userpass, password) {
            return bCrypt.compareSync(password, userpass);
        }
        User.findOne({where: {nom: nom}}).then(function(user) {
            console.log(user.pass);
            if (!user) {
                return done(null, false,req.flash('loginMessage', 'Utilisateur inconnu'));
            }
            if (!isValidPassword(user.pass, password)) {
                return done(null, false, req.flash('loginMessage', 'Mauvais mot de passe ou identifiants'));
            }
            var userinfo = user.get();
            return done(null, userinfo);
        }).catch(function(err) {
            console.log("Error:", err);
            return done(null, false, req.flash('loginMessage', 'Erreur lors du login'));
        });
    }
  ));
};
