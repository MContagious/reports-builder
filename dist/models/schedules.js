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
