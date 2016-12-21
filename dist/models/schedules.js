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
/**
{
  "name": "Hourly Test Report",
  "reports": [
    {
      "heading": "Test Report Heading 1",
      "name": "TestReport1",
      "options": {
        "Attachment": true,
        "EmailBody": true,
        "AttachmentType": "XLSX"
      },
      "outfile_pattern": "{{RPTNAME}}_{{YYYY}}_{{MM}}_{{DD}}"
    },
    {
      "heading": "Test Report Heading 2",
      "options": {
        "Attachment": true,
        "EmailBody": true,
        "AttachmentType": "CSV"
      },
      "name": "TestReport2",
      "outfile_pattern": "{{RPTNAME}}_{{YYYY}}_{{MM}}_{{DD}}"
    }
  ]
}
* */
var Schema1 = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        validate: [validatePresenceOf, 'Name cannot be blank']
    },
    crontab: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'Crontab cannot be blank']
    },
    subject: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'Crontab cannot be blank']
    },
    from: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'From cannot be blank']
    },
    to: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'To cannot be blank']
    },
    cc: {
        type: String
    },
    bcc: {
        type: String
    },
    message: {
        type: String
    },
    empty_message: {
        type: String
    },
    reports: [
        {
            "heading": {
                type: String,
                required: true,
                validate: [validatePresenceOf, 'Heading cannot be blank']
            },
            "name": {
                type: String,
                required: true,
                validate: [validatePresenceOf, 'Name cannot be blank']
            },
            "options": {
                "Attachment": {
                    type: Boolean
                },
                "EmailBody": {
                    type: Boolean
                },
                "Graph": {
                    type: Boolean
                },
                "AttachmentType": {
                    type: String,
                    validate: [validatePresenceOf, 'Name cannot be blank']
                }
            },
            formatting: {
                type: Boolean,
                default: false
            },
            cnd_formats: [{
                    field: {
                        type: String,
                        validate: [validatePresenceOf, 'Format Field cannot be blank']
                    },
                    cnd: {
                        type: String,
                        validate: [validatePresenceOf, 'Format Condition cannot be blank']
                    },
                    frmt: {
                        type: String,
                        validate: [validatePresenceOf, 'Format Condition cannot be blank']
                    },
                    th: {
                        type: Number,
                        validate: [validatePresenceOf, 'Format Threshold cannot be blank']
                    }
                }],
            enable_pivot: {
                type: Boolean,
                default: false
            },
            pivot: {
                report_filter: {
                    type: String
                },
                column_labels: {
                    type: String
                },
                row_labels: {
                    type: String
                },
                sum_data_values: {
                    type: String
                },
                count_data_values: {
                    type: String
                },
                merge_row_labels_data: {
                    type: Boolean,
                    default: false
                }
            },
            graph: {
                heading: {
                    type: String
                },
                xcol: {
                    type: String
                },
                yaxix_name: {
                    type: String
                },
                columns_filter: {
                    type: String
                },
                type: {
                    type: String,
                    default: 'GroupedBarChart'
                }
            },
            "outfile_pattern": {
                type: String,
                required: true,
                validate: [validatePresenceOf, 'Name cannot be blank']
            }
        }
    ]
});
/**
 * Methods
 */
Schema1.methods = {};
mongoose_1.model('Schedules', Schema1);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZWR1bGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21vZGVscy9zY2hlZHVsZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0dBRUc7QUFFSCxZQUFZLENBQUM7QUFFYjs7R0FFRztBQUNILHVDQUF5QztBQUN6Qzs7R0FFRztBQUNILElBQUksa0JBQWtCLEdBQUcsVUFBUyxLQUFLO0lBQ25DLDRFQUE0RTtJQUM1RSxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztBQUN4QixDQUFDLENBQUM7QUFFRjs7R0FFRztBQUVDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQTBCSTtBQUVSLElBQUksT0FBTyxHQUFHLElBQUksaUJBQU0sQ0FBQztJQUNyQixJQUFJLEVBQUU7UUFDRixJQUFJLEVBQUUsTUFBTTtRQUNaLFFBQVEsRUFBRSxJQUFJO1FBQ2QsTUFBTSxFQUFFLElBQUk7UUFDWixRQUFRLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxzQkFBc0IsQ0FBQztLQUN6RDtJQUNELE9BQU8sRUFBRTtRQUNMLElBQUksRUFBRSxNQUFNO1FBQ1osUUFBUSxFQUFFLElBQUk7UUFDZCxRQUFRLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSx5QkFBeUIsQ0FBQztLQUM1RDtJQUNELE9BQU8sRUFBRTtRQUNMLElBQUksRUFBRSxNQUFNO1FBQ1osUUFBUSxFQUFFLElBQUk7UUFDZCxRQUFRLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSx5QkFBeUIsQ0FBQztLQUM1RDtJQUNELElBQUksRUFBRTtRQUNGLElBQUksRUFBRSxNQUFNO1FBQ1osUUFBUSxFQUFFLElBQUk7UUFDZCxRQUFRLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxzQkFBc0IsQ0FBQztLQUN6RDtJQUNELEVBQUUsRUFBRTtRQUNBLElBQUksRUFBRSxNQUFNO1FBQ1osUUFBUSxFQUFFLElBQUk7UUFDZCxRQUFRLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxvQkFBb0IsQ0FBQztL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