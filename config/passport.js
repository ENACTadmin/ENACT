// config/passport.js

// load all the things we need
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const LocalStrategy = require('passport-local').Strategy;

// load up the user model
const User = require('../models/User');

// load the auth variables
const clientID = process.env.clientID || "960287962764-j4nvij4n7tlp1mng142c49kb0k9jmc1d.apps.googleusercontent.com";
const clientSecret = process.env.clientSecret || "Qde03Ut985sCMXZpyYNsaN39";
const callbackURL = process.env.callbackURL || "http://127.0.0.1:3500/login/authorized";


module.exports = function (passport) {
    console.log("In passport")

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        // console.log('in serializeUser ' + user);
        done(null, user._id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        // console.log('in deserializeUser');
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    // code for login (use('local-login', new LocalStategy))
    // code for signup (use('local-signup', new LocalStategy))
    // code for facebook (use('facebook', new FacebookStrategy))
    // code for twitter (use('twitter', new TwitterStrategy))

    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({

            clientID: clientID,
            clientSecret: clientSecret,
            callbackURL: callbackURL

        },

        function (token, refreshToken, profile, done) {

            // make the code asynchronous
            // User.findOne won't fire until we have all our data back from Google
            process.nextTick(function () {
                // console.log("looking for userid")
                // try to find the user based on their google id
                User.findOne({'googleid': profile.id}, function (err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                        // console.log(`the user was found ${user}`);
                        // if a user is found, log them in
                        return done(null, user);
                    } else {
                        console.log(`we need to create a new user`);
                        console.dir(profile);
                        // if the user isnt in our database, create a new user
                        var newUser
                            = new User(
                            {
                                googleid: profile.id,
                                googletoken: token,
                                googlename: profile.displayName,
                                googleemail: profile.emails[0].value,
                            });

                        // set all of the relevant information
                        /*
                        newUser.google = {}
                        newUser.google.id    = profile.id;
                        newUser.google.token = token;
                        newUser.google.name  = profile.displayName;
                        newUser.google.email = profile.emails[0].value; // pull the first email
                        */
                        // save the user
                        newUser.save(function (err) {
                            console.log("saving the new user");
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            });
        })
    );


    // =========================================================================
    // LOCAL ===================================================================
    // =========================================================================
    passport.use('local', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function (username, password, done) {
            console.log('In local login strategy')
            User.findOne({
                $or: [
                    {workEmail: username}, {googleemail: username}
                ]
            }, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {message: 'Incorrect username.'});
                }
                if (user.password !== password) {
                    return done(null, false, {message: 'Incorrect password.'});
                }
                return done(null, user);
            });
        }
    ));

    passport.use('local-reset', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function (username, password, done) {
            User.findOne({
                    $or: [
                        {workEmail: username}, {googleemail: username}
                    ]
                }, function (err, user) {
                    console.log("found user is: ", user)
                    if (err) {
                        return done(err);
                    }
                    if (!user) {
                        return done(null, false, {message: 'Incorrect username.'});
                    }
                    if (user.password !== password) {
                        return done(null, false, {message: 'Incorrect password.'});
                    }
                    return done(null, user);
                }
            )
            ;
        }
    ));

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password'
        },
        function (username, password, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            username = username.toLowerCase()

            User.findOne({
                $or: [
                    {workEmail: username}, {googleemail: username}
                ]
            }, function (err, user) {
                console.log("found user is: ", user)
                // if there are any errors, return the error
                if (err)
                    return done(err);
                // check to see if theres already a user with that email
                if (user) {
                    return done(null, false, {message: 'That email is already taken.'});
                } else {
                    // if there is no user with that email
                    // create the user
                    var newUser = User();
                    //
                    // set the user's local credentials
                    newUser.workEmail = username.toLowerCase();
                    newUser.password = password;

                    // save the user
                    newUser.save(function (err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        }
    ));
};
