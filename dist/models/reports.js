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
 * Reports Schema
 */
var ReportsSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        validate: [validatePresenceOf, 'Name cannot be blank']
    },
    queries: [{
            query: {
                type: String,
                required: true,
                validate: [validatePresenceOf, 'Query cannot be blank']
            },
            database: {
                type: String,
                required: true,
                validate: [validatePresenceOf, 'dbname cannot be blank']
            }
        }],
    aggregate_query: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'Agg Query cannot be blank']
    },
    tags: {
        type: String
    },
    Options: {
        type: String,
        default: ''
    }
});
/**
 * Methods
 */
ReportsSchema.methods = {};
mongoose_1.model('Reports', ReportsSchema);
