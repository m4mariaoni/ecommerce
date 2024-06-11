const createError = require('http-errors');
const UserModel = require('../models/user');
const UserModelInstance = new UserModel();

module.exports = class AuthService{
    async register(data){
        try {
            const {email} = data;

            // Check if user already exists
            const user = await UserModelInstance.findOneByEmail(email);

            // If user already exists, reject
            if(user){
                throw new createError(409, 'Email already exist');
            }

            return await UserModelInstance.create(data);


        } catch (error) {
            throw new createError(500, error);
        }
    };


    async login(data){
        const {email, password} = data;

        try {
                const user = await UserModelInstance.findOneByEmail(email);

                if(!user){
                   throw  new createError(401, 'username not found');
                }

                if(user.password !== password){
                    throw createError(401, 'Incorrect username or password');
                }

                return user;
            
        } catch (error) {
            throw new createError(500, error);
        }
    }

}