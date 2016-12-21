/**
 * Created by kishore.relangi on 8/8/2014.
 */
let xlsx = require('./node-xlsx');
let _ = require('underscore');
interface Array<T> {
   sum(o: T): number;
   count(o:T): number;
   avg(o:T): number;
}
Array.prototype.sum = function () {
    return this.reduce((n, v) => n+v, 0);
};

Array.prototype.count = function () {
 return this.reduce((n, v) => n+1, 0);
};

Array.prototype.avg = function () {
 return (this.sum()/this.count());
};

let numAlpha = function (i) {
    let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let t = Math.floor(i / 26) - 1; return (t > -1 ? numAlpha(t) : '') + alphabet.charAt(i % 26);
};
let get_colspan = function (columns:any):number {
    let keys:string[] = Object.keys(columns);
    if (keys.length > 0) {
        (keys.map((k) => get_colspan(columns[k]))).sum(); 
    } else {
        return 1;
    }
};
export async function fromJsonObj (objs, raw = false):Promise<{xlsx:string,wd}> {
    console.log(objs);
    return new Promise<{xlsx,wd}>((resolve, reject) => {
        let worksheets_data = [];

        objs.forEach(function(obj){
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
                rows.forEach((row)=> {               
                let Ckeys = [];
                let Rkeys = [];
                let Fkeys = [];
                column_labels.forEach((label)=>{
                    Ckeys.push(row[label]); 
                });
                row_labels.forEach((label)=>{
                    Rkeys.push(row[label]); 
                });
                filter_labels.forEach((label)=>{
                    Fkeys.push(row[label]); 
                });
                Object.keys(data_values).forEach((dv)=>{
                    half_transformed[Fkeys.join('-')]	
                            = half_transformed[Fkeys.join(';')] || {};
                    half_transformed[Fkeys.join('-')][Rkeys.join(';')] 
                            = half_transformed[Fkeys.join('-')][Rkeys.join(';')] || {};

                    half_transformed[Fkeys.join('-')][Rkeys.join(';')][Ckeys.join(';')] 	
                        =  	half_transformed[Fkeys.join('-')][Rkeys.join(';')][Ckeys.join(';')] || {};
                    half_transformed[Fkeys.join('-')][Rkeys.join(';')][Ckeys.join(';')][dv] 
                        = 	half_transformed[Fkeys.join('-')][Rkeys.join(';')][Ckeys.join(';')][dv] || [];
                    
                    half_transformed[Fkeys.join('-')][Rkeys.join(';')][Ckeys.join(';')][dv].push(row[dv]);
                });               
                });
                debugger;
                let transformed = {};
                
                let Cols = {                
                };
                
                Object.keys(half_transformed).forEach((filter_key)=>{                              
                Object.keys(half_transformed[filter_key]).forEach((r_key)=>{
                    let single = {};
                    let r_keys = r_key.split(';');
                    for(let i=0; i<r_keys.length; i++) {
                        single[row_labels[i]] = r_keys[i];                      
                    }
                    Object.keys(half_transformed[filter_key][r_key]).forEach((c_key)=>{
                        let c_keys = c_key.split(';');                      
                        let current = single;
                        let parent = {};
                        let col = Cols;
                        let pcol = {};
                        for(let i=0; i<c_keys.length; i++) {
                            current[c_keys[i]] = current[c_keys[i]] || {};
                            parent = current;
                            current = current[c_keys[i]];
                            col[c_keys[i]] = col[c_keys[i]] || {};
                            pcol = col;
                            col = col[c_keys[i]];
                        }
                        Object.keys(data_values).forEach((dv)=>{
                            //debugger;
                            Object.keys(data_values[dv]).forEach((aggr)=>{
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
                            form_headers(columns[key], level+1);
                            debugger;
                            headers[level] = headers[level] || [];
                            headers[level].push({
                                value: key,
                                formatCode : get_format_code(key),
                                colSpan : get_colspan(columns[key]),
                                vAlign: 'center',
                                hAlign: 'center',
                                bold : 1,
                                fontSize : 12,
                                fillId : 2
                            });
                        });
                    } else if(Object.keys(columns).length == 1) {
                        headers[level] = headers[level] || [];
                        headers[level].push({
                            value: Object.keys(columns)[0],
                            formatCode : get_format_code(Object.keys(columns)[0]),
                            vAlign: 'center',
                            hAlign: 'center',
                            bold : 1,
                            fontSize : 12,
                            fillId : 2
                        });
                    }
                };
                
                form_headers(Cols,0);
                
                row_labels.reverse().forEach((label)=>{
                    headers[0].splice(0,0, {
                        value: label,
                        formatCode : get_format_code(label),
                        rowSpan : headers.length,
                        vAlign: 'center',
                        hAlign: 'center',
                        bold : 1,
                        fontSize : 12,
                        fillId : 2
                    });
                });
                let cols = [];
                let get_previous_rowspan = (o, i, j) => {
                    if (i != 0) {                    
                        if (o[i-1][j] !== undefined && o[i-1][j].rowSpan > 1){
                            return o[i-1][j].rowSpan;
                        } else {
                            return get_previous_rowspan(o, i-1, j);
                        }
                    } else {
                        return 0;
                    }
                };
                let j_nos = [];
                headers.forEach((header, i)=>{
                    debugger;
                    header.forEach(function(ele, j){
                        ele.colSpan = ele.colSpan || 1;
                        ele.rowSpan = ele.rowSpan || 1;
                        if (/Total of /.test(ele.value)) {
                            ele.rowSpan = headers.length - i;            
                        }
                        j_nos[i] = j_nos[i] || [];
                        for(let k=0; k<ele.colSpan; k++){
                            let out = {};
                            out[ele.value]=j;            
                            j_nos[i].push(out);
                        }
                    })
                });
                
                for(let i=0; i < j_nos.length; i++) {
                    for (let j=0; j < j_nos[i].length; j++) {
                        if (j_nos[i][j][Object.keys(j_nos[i][j])[0]] >= 0){
                            let ele = headers[i][j_nos[i][j][Object.keys(j_nos[i][j])[0]]];
                            
                            for (let z=1; z < ele.rowSpan; z++){
                                let out = {};
                                out[ele.value]=-1;
                                j_nos[i+z].splice(j,0,out)
                            }
                        }
                    }
                }       
                j_nos.forEach(function(header, i){        
                    header.forEach(function(ele, j){
                    cols[j] = cols[j] || [];
                    if (j_nos[i][j][Object.keys(j_nos[i][j])[0]] != -1) {
                        cols[j].push(Object.keys(j_nos[i][j])[0]);
                    }
                    });
                });
                Object.keys(transformed).forEach((filter_key)=>{
                    let data = headers.slice(0);
                    let fillIdFlag = 1;
                    transformed[filter_key].forEach((row)=>{
                        let RowData = [];
                        for(let i=0; i<cols.length; i++) {
                            let val = row;
                            for(let j=0; j<cols[i].length; j++) {
                                val = val[cols[i][j]] || {};
                            }
                            RowData.push({                            
                                value: typeof(val) == "object" ? 0 : val,
                                formatCode : "General",
                                fillId : {0:3, 1: 0}[fillIdFlag%2]
                            });
                        }
                        fillIdFlag++;
                        data.push(RowData);
                    });
                    let RowData = [];
                    RowData.push({
                        value: 'Totals',
                        formatCode : "General",
                        colSpan : row_labels.length,
                        fillId : 4
                    });               
                    
                    for(let i=headers.length; i < data.length; i++) {                    
                        for(let j=row_labels.length, k=1; j<data[i].length; j++, k++) {
                            RowData[k] = (RowData[k] || {
                                value: 0,
                                formatCode : "General",
                                fillId : 4
                            });
                            RowData[k].value 
                                = RowData[k].value + ((typeof(data[i][j]) == 'object') 
                                    ? data[i][j].value 
                                    : data[i][j]);
                        }   
                    }
                    if (obj.Pivot.merge_row_labels_data){
                        for(let i=data.length-1; i > headers.length; i--) {
                            for (let j=row_labels.length-1; j >=0 ; j--) {
                                if (data[i][j].value == data[i-1][j].value) {
                                    data[i-1][j].rowSpan 
                                        = data[i-1][j].rowSpan || data[i][j].rowSpan || 1;
                                    data[i-1][j].rowSpan++;
                                    data[i].splice(j, 1);
                                }
                            }
                        }   
                    }                
                    data.push(RowData);
                    worksheets_data.push({
                        "name"  : obj.Name+' ' + filter_key,
                        "data"  : data,
                        "maxCol": cols.length,
                        "maxRow": data.length,
                        "headers_len"     : headers.length || 1
                    });
                });
                
            } else {
                let rows = obj.Data;
                cols    = Object.keys(rows[0]);
                let data = rows.map((row) => {
                    return cols.map((col) => {
                        return {
                            value: row[col],
                            formatCode : get_format_code(col),
                            colname : col
                        };
                    });
                });

                data.splice(0,0, cols.map((col) => {
                    return {
                        value: col,
                        formatCode : "General"
                    };
                }));

                let cfrmts = {};

                obj.CFS.forEach((cf)=>{
                    cfrmts[cf.field] = cfrmts[cf.field] || {};
                    cfrmts[cf.field][cf.cnd] = cfrmts[cf.field][cf.cnd] || {};
                    cfrmts[cf.field][cf.cnd].th = cf.th;
                    cfrmts[cf.field][cf.cnd].frmt = cf.frmt;
                    cfrmts[cf.field][cf.cnd].range = numAlpha(cols.indexOf(cf.field)) + '2:' + numAlpha(cols.indexOf(cf.field)) + data.length;
                });

                worksheets_data.push({
                    "name"  : obj.Name,
                    "data"  : data,
                    "table" : true,
                    "maxCol": cols.length,
                    "maxRow": data.length,
                    "cfs"   : cfrmts,
                    "headers_len"     : 1
                });
            }        
        });

        try {

            let wd = JSON.parse(JSON.stringify(worksheets_data));
            let wantExcel = {};
            let headers = {};
            objs.forEach((r)=>{
            wantExcel[r.Name] = r.WantXLSX;
            headers[r.Name]  = r.ReportHeading || r.Name;
            });
            wd.forEach((ws)=>{
                ws.ReportHeading = headers[ws.name] || ws.name;
            });
            worksheets_data.forEach((a)=> {
                a.name = a.name.substring(0,30);
            });	
            if (raw == true){
                return resolve({
                    xlsx: xlsx.build({
                        worksheets : worksheets_data.filter((a) => wantExcel[a.name])
                    },{
                        defaultCellBorders: {
                            top:'000000',
                            bottom:'000000',
                            left:'000000',
                            right:'000000'
                        }
                    }),
                    wd
                });
            } else {
                return resolve({
                    xlsx: xlsx.build({
                            worksheets:worksheets_data
                        }).toString('base64'),
                    wd}
                );
            }
        } catch(e) {
            console.dir(e);
            reject(e)
        } 
    });
}
function get_format_code (col) {
    if (/date/i.test(col)) {
        return "YYYY-MM-DD";
    }
    else {
        return "General";
    }
}
export default fromJsonObj;