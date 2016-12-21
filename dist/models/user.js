'use strict';
/**
 * Module dependencies.
 */
const mongoose_1 = require("mongoose");
const crypto_1 = require("crypto");
/**
 * Validations
 */
var validatePresenceOf = function (value) {
    // If you are authenticating by any of the oauth strategies, don't validate.
    return (this.provider && this.provider !== 'local') || value.length;
};
/**
 * User Schema
 */
var UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'Name cannot be blank']
    },
    email: {
        type: String,
        required: true,
        match: [/.+\@.+\..+/, 'Please enter a valid email'],
        validate: [validatePresenceOf, 'Email cannot be blank']
    },
    username: {
        type: String,
        unique: true,
        validate: [validatePresenceOf, 'Username cannot be blank']
    },
    roles: {
        type: Array,
        default: ['authenticated']
    },
    hashed_password: {
        type: String,
        validate: [validatePresenceOf, 'Password cannot be blank']
    },
    provider: {
        type: String,
        default: 'local'
    },
    salt: String,
    facebook: {},
    twitter: {},
    github: {},
    google: {},
    linkedin: {}
});
/**
 * Virtuals
 */
UserSchema.virtual('password').set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.hashPassword(password);
}).get(function () {
    return this._password;
});
/**
 * Pre-save hook
 */
UserSchema.pre('save', function (next) {
    if (this.isNew && this.provider === 'local' && this.password && !this.password.length)
        return next(new Error('Invalid password'));
    next();
});
/**
 * Methods
 */
UserSchema.methods = {
    /**
     * HasRole - check if the user has required role
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */
    hasRole: function (role) {
        var roles = this.roles;
        return roles.indexOf('admin') !== -1 || roles.indexOf(role) !== -1;
    },
    /**
     * IsAdmin - check if the user is an administrator
     *
     * @return {Boolean}
     * @api public
     */
    isAdmin: function () {
        return this.roles.indexOf('admin') !== -1;
    },
    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */
    authenticate: function (plainText) {
        return this.hashPassword(plainText) === this.hashed_password;
    },
    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */
    makeSalt: function () {
        return crypto_1.randomBytes(16).toString('base64');
    },
    /**
     * Hash password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */
    hashPassword: function (password) {
        if (!password || !this.salt)
            return '';
        var salt = new Buffer(this.salt, 'base64');
        return crypto_1.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString('base64');
    }
};
mongoose_1.model('User', UserSchema);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvdXNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7QUFFYjs7R0FFRztBQUNILHVDQUF5QztBQUN6QyxtQ0FBaUQ7QUFDakQ7O0dBRUc7QUFDSCxJQUFJLGtCQUFrQixHQUFHLFVBQVMsS0FBSztJQUNuQyw0RUFBNEU7SUFDNUUsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLE9BQU8sQ0FBQyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUM7QUFDeEUsQ0FBQyxDQUFDO0FBRUY7O0dBRUc7QUFDSCxJQUFJLFVBQVUsR0FBRyxJQUFJLGlCQUFNLENBQUM7SUFDeEIsSUFBSSxFQUFFO1FBQ0YsSUFBSSxFQUFFLE1BQU07UUFDWixRQUFRLEVBQUUsSUFBSTtRQUNkLFFBQVEsRUFBRSxDQUFDLGtCQUFrQixFQUFFLHNCQUFzQixDQUFDO0tBQ3pEO0lBQ0QsS0FBSyxFQUFFO1FBQ0gsSUFBSSxFQUFFLE1BQU07UUFDWixRQUFRLEVBQUUsSUFBSTtRQUNkLEtBQUssRUFBRSxDQUFDLFlBQVksRUFBRSw0QkFBNEIsQ0FBQztRQUNuRCxRQUFRLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSx1QkFBdUIsQ0FBQztLQUMxRDtJQUNELFFBQVEsRUFBRTtRQUNOLElBQUksRUFBRSxNQUFNO1FBQ1osTUFBTSxFQUFFLElBQUk7UUFDWixRQUFRLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSwwQkFBMEIsQ0FBQztLQUM3RDtJQUNELEtBQUssRUFBRTtRQUNILElBQUksRUFBRSxLQUFLO1FBQ1gsT0FBTyxFQUFFLENBQUMsZUFBZSxDQUFDO0tBQzdCO0lBQ0QsZUFBZSxFQUFFO1FBQ2IsSUFBSSxFQUFFLE1BQU07UUFDWixRQUFRLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSwwQkFBMEIsQ0FBQztLQUM3RDtJQUNELFFBQVEs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