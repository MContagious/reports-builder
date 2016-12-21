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
 * DB Schema
 */
var DBSchema = new mongoose_1.Schema({
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
    Options: {
        type: String,
        default: ''
    }
});
/**
 * Methods
 */
DBSchema.methods = {};
mongoose_1.model('DB', DBSchema);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbW9kZWxzL2RiLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztHQUVHO0FBRUgsWUFBWSxDQUFDO0FBRWI7O0dBRUc7QUFDSCx1Q0FBeUM7QUFDekM7O0dBRUc7QUFDSCxJQUFJLGtCQUFrQixHQUFHLFVBQVMsS0FBSztJQUNuQyw0RUFBNEU7SUFDNUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7QUFDeEIsQ0FBQyxDQUFDO0FBRUY7O0dBRUc7QUFDSCxJQUFJLFFBQVEsR0FBRyxJQUFJLGlCQUFNLENBQUM7SUFDdEIsSUFBSSxFQUFFO1FBQ0YsSUFBSSxFQUFFLE1BQU07UUFDWixRQUFRLEVBQUUsSUFBSTtRQUNkLE1BQU0sRUFBRSxJQUFJO1FBQ1osUUFBUSxFQUFFLENBQUMsa0JBQWtCLEVBQUUsc0JBQXNCLENBQUM7S0FDekQ7SUFDRCxRQUFRLEVBQUU7UUFDTixJQUFJLEVBQUUsTUFBTTtRQUNaLFFBQVEsRUFBRSxJQUFJO1FBQ2QsUUFBUSxFQUFFLENBQUMsa0JBQWtCLEVBQUUsMEJBQTBCLENBQUM7S0FDN0Q7SUFDRCxRQUFRLEVBQUU7UUFDTixJQUFJLEVBQUUsTUFBTTtRQUNaLFFBQVEsRUFBRSxJQUFJO1FBQ2QsUUFBUSxFQUFFLENBQUMsa0JBQWtCLEVBQUUsMEJBQTBCLENBQUM7S0FDN0Q7SUFDRCxJQUFJLEVBQUU7UUFDRixJQUFJLEVBQUUsTUFBTTtRQUNaLFFBQVEsRUFBRSxJQUFJO1FBQ2QsUUFBUSxFQUFFLENBQUMsa0JBQWtCLEVBQUUsMEJBQTBCLENBQUM7S0FDN0Q7SUFDRCxJQUFJLEVBQUU7UUFDRixJQUFJLEVBQUUsTUFBTTtRQUNaLFFBQVEsRUFBRSxJQUFJO1FBQ2QsUUFBUSxFQUFFLENBQUMsa0JBQWtCLEVBQUUsMEJBQTBCLENBQUM7S0FDN0Q7SUFDRCxNQUFNLEVBQUU7UUFDSixJQUFJLEVBQUUsTUFBTTtRQUNaLFFBQVEsRUFBRSxJQUFJO1FBQ2QsUUFBUSxFQUFFLENBQUMsa0JBQWtCLEVBQUUsMEJBQTBCLENBQUM7S0FDN0Q7SUFDRCxPQUFPLEVBQUc7UUFDTixJQUFJLEVBQUUsTUFBTTtRQUNaLE9BQU8sRUFBRyxFQUFFO0tBQ2Y7Q0FDSixDQUFDLENBQUM7QUFHSDs7R0FFRztBQUNILFFBQVEsQ0FBQyxPQUFPLEdBQUcsRUFFbEIsQ0FBQztBQUVGLGdCQUFLLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDIn0=