"use strict";
const moment = require('moment');
function out_file_pattern_to_name(file_pattern, report) {
    file_pattern = file_pattern || '';
    (file_pattern.match(/\((.*?)\)(\+|-)(\d+)(\w+)/g) || []).forEach(function (p) {
        var mat = p.match(/\((.*?)\)(\+|-)(\d+)(\w+)/);
        var pattern = mat[1];
        var symbol = mat[2];
        var inc_dec_by = mat[4];
        var num = mat[3];
        var mom = moment();
        var replaced = '';
        if (symbol == '+') {
            replaced = replace_known_patterns(pattern, report, mom.add(num, inc_dec_by));
        }
        else {
            replaced = replace_known_patterns(pattern, report, mom.subtract(num, inc_dec_by.toLowerCase()));
        }
        file_pattern = file_pattern.replace(mat[0], replaced);
    });
    return replace_known_patterns(file_pattern, report);
}
exports.out_file_pattern_to_name = out_file_pattern_to_name;
function replace_known_patterns(file_pattern, report, mom) {
    mom = mom || moment();
    var pattern = file_pattern + '';
    var Options = {
        RPTNAME: report.Name
    };
    ["M", "Mo", "MM", "MMM", "MMMM", "Q", "D", "Do", "DD", "DDD", "DDDo", "DDDD", "d", "do", "dd", "ddd", "dddd", "e", "E", "w", "wo", "ww", "W", "Wo", "WW", "YY", "YYYY", "gg", "gggg", "GG", "GGGG", "A", "a", "H", "HH", "h", "hh", "m", "mm", "s", "ss", "S", "SS", "SSS", "z or zz", "Z", "ZZ", "X"]
        .forEach(function (ele) {
        Options[ele] = mom.format(ele);
    });
    Object.keys(Options).forEach(function (key) {
        var regex = new RegExp('{{' + key + '}}', 'g');
        pattern = pattern.replace(regex, Options[key]);
    });
    return pattern;
}
exports.replace_known_patterns = replace_known_patterns;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHJhbnNmb3JtTmFtZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvVXRpbHMvVHJhbnNmb3JtTmFtZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUVqQyxrQ0FBMEMsWUFBWSxFQUFFLE1BQWE7SUFDakUsWUFBWSxHQUFHLFlBQVksSUFBSSxFQUFFLENBQUM7SUFDbEMsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLDRCQUE0QixDQUFDLElBQUUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVMsQ0FBQztRQUNyRSxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLDJCQUEyQixDQUFDLENBQUM7UUFDL0MsSUFBSSxPQUFPLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JCLElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwQixJQUFJLFVBQVUsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEIsSUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRWpCLElBQUksR0FBRyxHQUFHLE1BQU0sRUFBRSxDQUFDO1FBQ25CLElBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQztRQUNsQixFQUFFLENBQUMsQ0FBQyxNQUFNLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNoQixRQUFRLEdBQUcsc0JBQXNCLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQ2pGLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLFFBQVEsR0FBRyxzQkFBc0IsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDcEcsQ0FBQztRQUNELFlBQVksR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUMxRCxDQUFDLENBQUMsQ0FBQztJQUNILE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxZQUFZLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDeEQsQ0FBQztBQW5CRCw0REFtQkM7QUFFRCxnQ0FBd0MsWUFBWSxFQUFFLE1BQU0sRUFBRSxHQUFJO0lBQzlELEdBQUcsR0FBRyxHQUFHLElBQUksTUFBTSxFQUFFLENBQUM7SUFDdEIsSUFBSSxPQUFPLEdBQUcsWUFBWSxHQUFHLEVBQUUsQ0FBQztJQUNoQyxJQUFJLE9BQU8sR0FBRztRQUNWLE9BQU8sRUFBRyxNQUFNLENBQUMsSUFBSTtLQUN4QixDQUFDO0lBQ0YsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQztTQUNqUyxPQUFPLENBQUMsVUFBUyxHQUFHO1FBQ2pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ25DLENBQUMsQ0FBQyxDQUFDO0lBQ1AsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBUyxHQUFHO1FBQ3JDLElBQUksS0FBSyxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksR0FBQyxHQUFHLEdBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzNDLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNuRCxDQUFDLENBQUMsQ0FBQztJQUNILE1BQU0sQ0FBQyxPQUFPLENBQUM7QUFDbkIsQ0FBQztBQWZELHdEQWVDIn0=