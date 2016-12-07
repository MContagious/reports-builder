/**
 * Created by kishore.relangi on 7/7/2014.
 */
'use strict';
/**
 * Module dependencies.
 */
const mongoose_1 = require('mongoose');
/**
 * Validations
 */
var validatePresenceOf = function (value) {
    // If you are authenticating by any of the oauth strategies, don't validate.
    return value.length;
};
/**
 * QB Schema
 */
var QBSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        validate: [validatePresenceOf, 'Name cannot be blank']
    },
    query: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'Query cannot be blank']
    },
    dbname: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'dbname cannot be blank']
    }
});
/**
 * Methods
 */
QBSchema.methods = {};
mongoose_1.model('QB', QBSchema);
