"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
/**
 * Created by kishore.relangi on 8/8/2014.
 */
let xlsx = require('./node-xlsx');
let _ = require('underscore');
Array.prototype.sum = function () {
    return this.reduce((n, v) => n + v, 0);
};
Array.prototype.count = function () {
    return this.reduce((n, v) => n + 1, 0);
};
Array.prototype.avg = function () {
    return (this.sum() / this.count());
};
let numAlpha = function (i) {
    let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let t = Math.floor(i / 26) - 1;
    return (t > -1 ? numAlpha(t) : '') + alphabet.charAt(i % 26);
};
let get_colspan = function (columns) {
    let keys = Object.keys(columns);
    if (keys.length > 0) {
        (keys.map((k) => get_colspan(columns[k]))).sum();
    }
    else {
        return 1;
    }
};
function fromJsonObj(objs, raw = false) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(objs);
        return new Promise((resolve, reject) => {
            let worksheets_data = [];
            objs.forEach(function (obj) {
                let cols = [];
                if (obj.Pivot.column_labels !== undefined) {
                    // Transform the obj.Data to required format
                    let filter_labels = obj.Pivot.report_filter.split(',');
                    let column_labels = obj.Pivot.column_labels.split(',');
                    let row_labels = obj.Pivot.row_labels.split(',');
                    obj.Pivot.sum_data_values = obj.Pivot.sum_data_values || '';
                    obj.Pivot.count_data_values = obj.Pivot.count_data_values || '';
                    let data_values = {};
                    obj.Pivot.sum_data_values.split(',').forEach((dv) => {
                        if (dv != '') {
                            data_values[dv] = data_values[dv] || {};
                            data_values[dv].sum = true;
                        }
                    });
                    obj.Pivot.count_data_values.split(',').forEach((dv) => {
                        if (dv != '') {
                            data_values[dv] = data_values[dv] || {};
                            data_values[dv].count = true;
                        }
                    });
                    let rows = obj.Data;
                    let half_transformed = {};
                    rows.forEach((row) => {
                        let Ckeys = [];
                        let Rkeys = [];
                        let Fkeys = [];
                        column_labels.forEach((label) => {
                            Ckeys.push(row[label]);
                        });
                        row_labels.forEach((label) => {
                            Rkeys.push(row[label]);
                        });
                        filter_labels.forEach((label) => {
                            Fkeys.push(row[label]);
                        });
                        Object.keys(data_values).forEach((dv) => {
                            half_transformed[Fkeys.join('-')]
                                = half_transformed[Fkeys.join(';')] || {};
                            half_transformed[Fkeys.join('-')][Rkeys.join(';')]
                                = half_transformed[Fkeys.join('-')][Rkeys.join(';')] || {};
                            half_transformed[Fkeys.join('-')][Rkeys.join(';')][Ckeys.join(';')]
                                = half_transformed[Fkeys.join('-')][Rkeys.join(';')][Ckeys.join(';')] || {};
                            half_transformed[Fkeys.join('-')][Rkeys.join(';')][Ckeys.join(';')][dv]
                                = half_transformed[Fkeys.join('-')][Rkeys.join(';')][Ckeys.join(';')][dv] || [];
                            half_transformed[Fkeys.join('-')][Rkeys.join(';')][Ckeys.join(';')][dv].push(row[dv]);
                        });
                    });
                    debugger;
                    let transformed = {};
                    let Cols = {};
                    Object.keys(half_transformed).forEach((filter_key) => {
                        Object.keys(half_transformed[filter_key]).forEach((r_key) => {
                            let single = {};
                            let r_keys = r_key.split(';');
                            for (let i = 0; i < r_keys.length; i++) {
                                single[row_labels[i]] = r_keys[i];
                            }
                            Object.keys(half_transformed[filter_key][r_key]).forEach((c_key) => {
                                let c_keys = c_key.split(';');
                                let current = single;
                                let parent = {};
                                let col = Cols;
                                let pcol = {};
                                for (let i = 0; i < c_keys.length; i++) {
                                    current[c_keys[i]] = current[c_keys[i]] || {};
                                    parent = current;
                                    current = current[c_keys[i]];
                                    col[c_keys[i]] = col[c_keys[i]] || {};
                                    pcol = col;
                                    col = col[c_keys[i]];
                                }
                                Object.keys(data_values).forEach((dv) => {
                                    //debugger;
                                    Object.keys(data_values[dv]).forEach((aggr) => {
                                        current[[aggr, "of", dv].join(" ")]
                                            = half_transformed[filter_key][r_key][c_key][dv][aggr]();
                                        col[[aggr, "of", dv].join(" ")] = {};
                                        parent[['Total', "of", dv].join(" ")]
                                            = parent[['Total', "of", dv].join(" ")] || 0;
                                        parent[['Total', "of", dv].join(" ")]
                                            += current[[aggr, "of", dv].join(" ")];
                                        pcol[['Total', "of", dv].join(" ")] = {};
                                    });
                                });
                            });
                            transformed[filter_key] = transformed[filter_key] || [];
                            transformed[filter_key].push(single);
                        });
                    });
                    let headers = [];
                    // Make headers || 0
                    let form_headers = (columns, level) => {
                        if (Object.keys(columns).length > 1) {
                            Object.keys(columns).sort()
                                .forEach((key) => {
                                form_headers(columns[key], level + 1);
                                debugger;
                                headers[level] = headers[level] || [];
                                headers[level].push({
                                    value: key,
                                    formatCode: get_format_code(key),
                                    colSpan: get_colspan(columns[key]),
                                    vAlign: 'center',
                                    hAlign: 'center',
                                    bold: 1,
                                    fontSize: 12,
                                    fillId: 2
                                });
                            });
                        }
                        else if (Object.keys(columns).length == 1) {
                            headers[level] = headers[level] || [];
                            headers[level].push({
                                value: Object.keys(columns)[0],
                                formatCode: get_format_code(Object.keys(columns)[0]),
                                vAlign: 'center',
                                hAlign: 'center',
                                bold: 1,
                                fontSize: 12,
                                fillId: 2
                            });
                        }
                    };
                    form_headers(Cols, 0);
                    row_labels.reverse().forEach((label) => {
                        headers[0].splice(0, 0, {
                            value: label,
                            formatCode: get_format_code(label),
                            rowSpan: headers.length,
                            vAlign: 'center',
                            hAlign: 'center',
                            bold: 1,
                            fontSize: 12,
                            fillId: 2
                        });
                    });
                    let cols = [];
                    let get_previous_rowspan = (o, i, j) => {
                        if (i != 0) {
                            if (o[i - 1][j] !== undefined && o[i - 1][j].rowSpan > 1) {
                                return o[i - 1][j].rowSpan;
                            }
                            else {
                                return get_previous_rowspan(o, i - 1, j);
                            }
                        }
                        else {
                            return 0;
                        }
                    };
                    let j_nos = [];
                    headers.forEach((header, i) => {
                        debugger;
                        header.forEach(function (ele, j) {
                            ele.colSpan = ele.colSpan || 1;
                            ele.rowSpan = ele.rowSpan || 1;
                            if (/Total of /.test(ele.value)) {
                                ele.rowSpan = headers.length - i;
                            }
                            j_nos[i] = j_nos[i] || [];
                            for (let k = 0; k < ele.colSpan; k++) {
                                let out = {};
                                out[ele.value] = j;
                                j_nos[i].push(out);
                            }
                        });
                    });
                    for (let i = 0; i < j_nos.length; i++) {
                        for (let j = 0; j < j_nos[i].length; j++) {
                            if (j_nos[i][j][Object.keys(j_nos[i][j])[0]] >= 0) {
                                let ele = headers[i][j_nos[i][j][Object.keys(j_nos[i][j])[0]]];
                                for (let z = 1; z < ele.rowSpan; z++) {
                                    let out = {};
                                    out[ele.value] = -1;
                                    j_nos[i + z].splice(j, 0, out);
                                }
                            }
                        }
                    }
                    j_nos.forEach(function (header, i) {
                        header.forEach(function (ele, j) {
                            cols[j] = cols[j] || [];
                            if (j_nos[i][j][Object.keys(j_nos[i][j])[0]] != -1) {
                                cols[j].push(Object.keys(j_nos[i][j])[0]);
                            }
                        });
                    });
                    Object.keys(transformed).forEach((filter_key) => {
                        let data = headers.slice(0);
                        let fillIdFlag = 1;
                        transformed[filter_key].forEach((row) => {
                            let RowData = [];
                            for (let i = 0; i < cols.length; i++) {
                                let val = row;
                                for (let j = 0; j < cols[i].length; j++) {
                                    val = val[cols[i][j]] || {};
                                }
                                RowData.push({
                                    value: typeof (val) == "object" ? 0 : val,
                                    formatCode: "General",
                                    fillId: { 0: 3, 1: 0 }[fillIdFlag % 2]
                                });
                            }
                            fillIdFlag++;
                            data.push(RowData);
                        });
                        let RowData = [];
                        RowData.push({
                            value: 'Totals',
                            formatCode: "General",
                            colSpan: row_labels.length,
                            fillId: 4
                        });
                        for (let i = headers.length; i < data.length; i++) {
                            for (let j = row_labels.length, k = 1; j < data[i].length; j++, k++) {
                                RowData[k] = (RowData[k] || {
                                    value: 0,
                                    formatCode: "General",
                                    fillId: 4
                                });
                                RowData[k].value
                                    = RowData[k].value + ((typeof (data[i][j]) == 'object')
                                        ? data[i][j].value
                                        : data[i][j]);
                            }
                        }
                        if (obj.Pivot.merge_row_labels_data) {
                            for (let i = data.length - 1; i > headers.length; i--) {
                                for (let j = row_labels.length - 1; j >= 0; j--) {
                                    if (data[i][j].value == data[i - 1][j].value) {
                                        data[i - 1][j].rowSpan
                                            = data[i - 1][j].rowSpan || data[i][j].rowSpan || 1;
                                        data[i - 1][j].rowSpan++;
                                        data[i].splice(j, 1);
                                    }
                                }
                            }
                        }
                        data.push(RowData);
                        worksheets_data.push({
                            "name": obj.Name + ' ' + filter_key,
                            "data": data,
                            "maxCol": cols.length,
                            "maxRow": data.length,
                            "headers_len": headers.length || 1
                        });
                    });
                }
                else {
                    let rows = obj.Data;
                    cols = Object.keys(rows[0]);
                    let data = rows.map((row) => {
                        return cols.map((col) => {
                            return {
                                value: row[col],
                                formatCode: get_format_code(col),
                                colname: col
                            };
                        });
                    });
                    data.splice(0, 0, cols.map((col) => {
                        return {
                            value: col,
                            formatCode: "General"
                        };
                    }));
                    let cfrmts = {};
                    obj.CFS.forEach((cf) => {
                        cfrmts[cf.field] = cfrmts[cf.field] || {};
                        cfrmts[cf.field][cf.cnd] = cfrmts[cf.field][cf.cnd] || {};
                        cfrmts[cf.field][cf.cnd].th = cf.th;
                        cfrmts[cf.field][cf.cnd].frmt = cf.frmt;
                        cfrmts[cf.field][cf.cnd].range = numAlpha(cols.indexOf(cf.field)) + '2:' + numAlpha(cols.indexOf(cf.field)) + data.length;
                    });
                    worksheets_data.push({
                        "name": obj.Name,
                        "data": data,
                        "table": true,
                        "maxCol": cols.length,
                        "maxRow": data.length,
                        "cfs": cfrmts,
                        "headers_len": 1
                    });
                }
            });
            try {
                let wd = JSON.parse(JSON.stringify(worksheets_data));
                let wantExcel = {};
                let headers = {};
                objs.forEach((r) => {
                    wantExcel[r.Name] = r.WantXLSX;
                    headers[r.Name] = r.ReportHeading || r.Name;
                });
                wd.forEach((ws) => {
                    ws.ReportHeading = headers[ws.name] || ws.name;
                });
                worksheets_data.forEach((a) => {
                    a.name = a.name.substring(0, 30);
                });
                if (raw == true) {
                    return resolve({
                        xlsx: xlsx.build({
                            worksheets: worksheets_data.filter((a) => wantExcel[a.name])
                        }, {
                            defaultCellBorders: {
                                top: '000000',
                                bottom: '000000',
                                left: '000000',
                                right: '000000'
                            }
                        }),
                        wd
                    });
                }
                else {
                    return resolve({
                        xlsx: xlsx.build({
                            worksheets: worksheets_data
                        }).toString('base64'),
                        wd
                    });
                }
            }
            catch (e) {
                console.dir(e);
                reject(e);
            }
        });
    });
}
exports.fromJsonObj = fromJsonObj;
function get_format_code(col) {
    if (/date/i.test(col)) {
        return "YYYY-MM-DD";
    }
    else {
        return "General";
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = fromJsonObj;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiWExTWC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9YTFNYLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ2xDLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQU05QixLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsR0FBRztJQUNsQixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN6QyxDQUFDLENBQUM7QUFFRixLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRztJQUN2QixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN0QyxDQUFDLENBQUM7QUFFRixLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsR0FBRztJQUNyQixNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7QUFDbEMsQ0FBQyxDQUFDO0FBRUYsSUFBSSxRQUFRLEdBQUcsVUFBVSxDQUFDO0lBQ3RCLElBQUksUUFBUSxHQUFHLDRCQUE0QixDQUFDO0lBQzVDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7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