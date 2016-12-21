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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwb3J0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvcmVwb3J0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7R0FFRztBQUVILFlBQVksQ0FBQztBQUViOztHQUVHO0FBQ0gsdUNBQXlDO0FBQ3pDOztHQUVHO0FBQ0gsSUFBSSxrQkFBa0IsR0FBRyxVQUFTLEtBQUs7SUFDbkMsNEVBQTRFO0lBQzVFLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO0FBQ3hCLENBQUMsQ0FBQztBQUVGOztHQUVHO0FBQ0gsSUFBSSxhQUFhLEdBQUcsSUFBSSxpQkFBTSxDQUFDO0lBQzNCLElBQUksRUFBRTtRQUNGLElBQUksRUFBRSxNQUFNO1FBQ1osUUFBUSxFQUFFLElBQUk7UUFDZCxNQUFNLEVBQUUsSUFBSTtRQUNaLFFBQVEsRUFBRSxDQUFDLGtCQUFrQixFQUFFLHNCQUFzQixDQUFDO0tBQ3pEO0lBQ0QsT0FBTyxFQUFHLENBQUM7WUFDUCxLQUFLLEVBQUU7Z0JBQ0gsSUFBSSxFQUFFLE1BQU07Z0JBQ1osUUFBUSxFQUFFLElBQUk7Z0JBQ2QsUUFBUSxFQUFFLENBQUMsa0JBQWtCLEVBQUUsdUJBQXVCLENBQUM7YUFDMUQ7WUFDRCxRQUFRLEVBQUU7Z0JBQ04sSUFBSSxFQUFFLE1BQU07Z0JBQ1osUUFBUSxFQUFFLElBQUk7Z0JBQ2QsUUFBUSxFQUFFLENBQUMsa0JBQWtCLEVBQUUsd0JBQXdCLENBQUM7YUFDM0Q7U0FDSixDQUFDO0lBQ0YsZUFBZSxFQUFFO1FBQ2IsSUFBSSxFQUFFLE1BQU07UUFDWixRQUFRLEVBQUUsSUFBSTtRQUNkLFFBQVEsRUFBRSxDQUFDLGtCQUFrQixFQUFFLDJCQUEyQixDQUFDO0tBQzlEO0lBQ0QsSUFBSSxFQUFFO1FBQ0YsSUFBSSxFQUFFLE1BQU07S0FDZjtJQUNELE9BQU8sRUFBRztRQUNOLElBQUksRUFBRSxNQUFNO1FBQ1osT0FBTyxFQUFHLEVBQUU7S0FDZjtDQUNKLENBQUMsQ0FBQztBQUdIOztHQUVHO0FBQ0gsYUFBYSxDQUFDLE9BQU8sR0FBRyxFQUV2QixDQUFDO0FBRUYsZ0JBQUssQ0FBQyxTQUFTLEVBQUUsYUFBYSxDQUFDLENBQUMifQ==