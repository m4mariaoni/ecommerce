 const passport = require('passport'); //for authentication
const LocalStrategy = require('passport-local').Strategy;

const AuthService = require('../services/AuthService');
const AuthServiceInstance = new AuthService();

module.exports = (app) => {

  // Initialize passport
  app.use(passport.initialize());  
  app.use(passport.session());
  
  // Set method to serialize data to store in cookie
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  // Set method to deserialize data stored in cookie and attach to req.user
  passport.deserializeUser((id, done) => {
    done(null, { id });
  });

  // Configure local strategy to be use for local login
  passport.use(new LocalStrategy(    {
      usernameField: 'email', // specify the username field
      passwordField: 'password' // specify the password field
    },
    async (email, password, done) => {
      try {
        const user = await AuthServiceInstance.login({ email, password });
        return done(null, user);
      } catch(err) {
        return done(err);
      }
    }
  ));

  return passport;

} 



/* const passport = require('passport'); // for authentication
const LocalStrategy = require('passport-local').Strategy;

const AuthService = require('../services/AuthService');
const AuthServiceInstance = new AuthService();

module.exports = (app) => {

  // Initialize passport
  app.use(passport.initialize());  
  app.use(passport.session());
  
  // Set method to serialize data to store in cookie
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  // Set method to deserialize data stored in cookie and attach to req.user
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await AuthServiceInstance.findUserById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Configure local strategy to be used for local login
  passport.use(new LocalStrategy(
    {
      usernameField: 'email', // specify the username field
      passwordField: 'password' // specify the password field
    },
    async (email, password, done) => {
      try {
        const user = await AuthServiceInstance.login({ email, password });
        if (!user) {
          return done(null, false, { message: 'Invalid email or password' });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ));

  return passport;
}
 */