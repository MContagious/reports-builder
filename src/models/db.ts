/**
 * Created by kishore.relangi on 7/7/2014.
 */

'use strict';

/**
 * Module dependencies.
 */
import { Schema, model } from 'mongoose';
/**
 * Validations
 */
var validatePresenceOf = function(value) {
    // If you are authenticating by any of the oauth strategies, don't validate.
    return value.length;
};

/**
 * DB Schema
 */
var DBSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        validate: [validatePresenceOf, 'Name cannot be blank']
    },
    username: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'Username cannot be blank']
    },
    password: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'Password cannot be blank']
    },
    host: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'Password cannot be blank']
    },
    port: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'Password cannot be blank']
    },
    dbType: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'Password cannot be blank']
    },
    Options : {
        type: String,
        default : ''
    }
});


/**
 * Methods
 */
DBSchema.methods = {

};

model('DB', DBSchema);