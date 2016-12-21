const moment = require('moment');

export function out_file_pattern_to_name (file_pattern, report:{Name}):string {
    file_pattern = file_pattern || '';
    (file_pattern.match(/\((.*?)\)(\+|-)(\d+)(\w+)/g)||[]).forEach(function(p){
        var mat = p.match(/\((.*?)\)(\+|-)(\d+)(\w+)/);
        var pattern = mat[1];
        var symbol = mat[2];
        var inc_dec_by = mat[4];
        var num = mat[3];

        var mom = moment();
        var replaced = '';
        if (symbol == '+') {
            replaced = replace_known_patterns(pattern, report, mom.add(num, inc_dec_by));
        } else {
            replaced = replace_known_patterns(pattern, report, mom.subtract(num, inc_dec_by.toLowerCase()));
        }
        file_pattern = file_pattern.replace(mat[0], replaced);
    });
    return replace_known_patterns(file_pattern, report);
}

export function replace_known_patterns (file_pattern, report, mom?):string {
    mom = mom || moment();
    var pattern = file_pattern + '';
    var Options = {
        RPTNAME : report.Name
    };
    ["M", "Mo", "MM", "MMM", "MMMM", "Q", "D", "Do", "DD", "DDD", "DDDo", "DDDD", "d", "do", "dd", "ddd", "dddd", "e", "E", "w", "wo", "ww", "W", "Wo", "WW", "YY", "YYYY", "gg", "gggg", "GG", "GGGG", "A", "a", "H", "HH", "h", "hh", "m", "mm", "s", "ss", "S", "SS", "SSS", "z or zz", "Z", "ZZ", "X"]
        .forEach(function(ele){
            Options[ele] = mom.format(ele);
        });
    Object.keys(Options).forEach(function(key){
        var regex = new RegExp('{{'+key+'}}', 'g');
        pattern = pattern.replace(regex, Options[key]);
    });
    return pattern;
}