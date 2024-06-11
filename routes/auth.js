const express = require('express');
const router = express.Router();


// Instantiate Services
const AuthService = require('../services/AuthService');
const AuthServiceInstance = new AuthService();

module.exports = (app, passport) => {
    app.use('/auth', router);

     // Registration Endpoint
     router.post('/register', async(req, res, next) =>{
        try {
            const data = req.body;

            const response = await AuthServiceInstance.register(data);
            res.status(200).send(response);
        } catch (error) {
            next(error);
        }
     });

      // Login Endpoint
     router.post('/login', passport.authenticate('local'), async(req, res, next) => {
        try {
            const {email, password} = req.body;

            const response = await AuthServiceInstance.login({email, password});
            res.status(200).send(response);
        } catch (error) {
            next(error);
        }
     }); 


     /* router.post('/login', (req, res, next) => {
        passport.authenticate('local', async (err, user, info) => {
          if (err) return next(err);
          if (!user) return res.status(401).json({ message: 'Invalid email or password' });
      
          req.logIn(user, async (err) => {
            if (err) return next(err);
      
            try {
              const { email, password } = req.body;
              const response = await AuthServiceInstance.login({ email, password });
              res.status(200).send(response);
            } catch (error) {
              next(error);
            }
          });
        })(req, res, next);
      });
       */

}
