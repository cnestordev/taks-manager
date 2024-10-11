const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const argon2 = require('argon2');
const User = require('../models/User');

// Configure Local Strategy for Passport
passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            const user = await User.findOne({ username });
            if (!user) return done(null, false, { message: 'User not found' });

            const isValid = await argon2.verify(user.passwordHash, password);
            if (isValid) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Invalid password' });
            }
        } catch (error) {
            return done(error);
        }
    }
));

// Serialize and Deserialize User
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

module.exports = passport;