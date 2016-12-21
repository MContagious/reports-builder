/**
 * Created by kishore.relangi on 7/7/2014.
 */
'use strict';
/**
 * Module dependencies.
 */
const mongoose_1 = require("mongoose");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicWIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbW9kZWxzL3FiLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztHQUVHO0FBRUgsWUFBWSxDQUFDO0FBRWI7O0dBRUc7QUFDSCx1Q0FBeUM7QUFDekM7O0dBRUc7QUFDSCxJQUFJLGtCQUFrQixHQUFHLFVBQVMsS0FBSztJQUNuQyw0RUFBNEU7SUFDNUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7QUFDeEIsQ0FBQyxDQUFDO0FBRUY7O0dBRUc7QUFDSCxJQUFJLFFBQVEsR0FBRyxJQUFJLGlCQUFNLENBQUM7SUFDdEIsSUFBSSxFQUFFO1FBQ0YsSUFBSSxFQUFFLE1BQU07UUFDWixRQUFRLEVBQUUsSUFBSTtRQUNkLE1BQU0sRUFBRSxJQUFJO1FBQ1osUUFBUSxFQUFFLENBQUMsa0JBQWtCLEVBQUUsc0JBQXNCLENBQUM7S0FDekQ7SUFDRCxLQUFLLEVBQUU7UUFDSCxJQUFJLEVBQUUsTUFBTTtRQUNaLFFBQVEsRUFBRSxJQUFJO1FBQ2QsUUFBUSxFQUFFLENBQUMsa0JBQWtCLEVBQUUsdUJBQXVCLENBQUM7S0FDMUQ7SUFDRCxNQUFNLEVBQUU7UUFDSixJQUFJLEVBQUUsTUFBTTtRQUNaLFFBQVEsRUFBRSxJQUFJO1FBQ2QsUUFBUSxFQUFFLENBQUMsa0JBQWtCLEVBQUUsd0JBQXdCLENBQUM7S0FDM0Q7Q0FDSixDQUFDLENBQUM7QUFHSDs7R0FFRztBQUNILFFBQVEsQ0FBQyxPQUFPLEdBQUcsRUFFbEIsQ0FBQztBQUVGLGdCQUFLLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDIn0=