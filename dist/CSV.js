"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const svg2png = require('svg2png');
// const fs = require('fs');
const fs_1 = require("fs");
const d3 = require('d3');
class CSV {
    constructor(rows) {
        let cols = Object.keys(rows[0]);
        this.csv = cols.join(',') + "\n" +
            rows.map(function (row) {
                return cols.map(function (col) {
                    return row[col];
                }).join(',');
            }).join('\n');
    }
    getCSV(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            if (opts.Attachment && opts.AttachmentType == 'CSV') {
                return this.csv;
            }
            else {
                return undefined;
            }
        });
    }
    getGraph(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            let csvdata = this.csv;
            return new Promise((resolve, reject) => {
                if (!opts.heading) {
                    return resolve(undefined);
                }
                var dtnumb = +(new Date());
                var margin = { top: 20, right: 20, bottom: 30, left: 40 }, org_width = (csvdata.split('\n').length - 1) * 60 + margin.left + 25 + margin.right, width = org_width - margin.left - margin.right, height = 500 - margin.top - margin.bottom;
                var cols = opts.cols || csvdata.split('\n')[0].split(',');
                var xcol = cols[0];
                var yaxix_name = opts.yaxis_name || 'Name for Y-Axis';
                var x0 = d3.scaleBand()
                    .rangeRound([0, width - 18])
                    .padding(.1);
                var x1 = d3.scaleOrdinal();
                var y = d3.scaleLinear()
                    .range([height, 0]);
                var color = d3.scaleOrdinal()
                    .range(["#ff6262", "#62ff62", "#6262ff", "#ff8c00", "#970097", "#77c8a2", "#edf549"]);
                var xAxis = d3.axisBottom()
                    .scale(x0);
                var yAxis = d3.axisLeft()
                    .scale(y)
                    .tickFormat(d3.format(".2s"));
                let svg = d3.select("body").append('div').attr('id', 'svg' + dtnumb)
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .attr("xmlns:dc", "http://purl.org/dc/elements/1.1/")
                    .attr("xmlns:cc", "http://creativecommons.org/ns#")
                    .attr("xmlns:rdf", "http://www.w3.org/1999/02/22-rdf-syntax-ns#")
                    .attr('xmlns:svg', "http://www.w3.org/2000/svg")
                    .attr('xmlns', "http://www.w3.org/2000/svg")
                    .attr('id', 'svg2')
                    .attr('version', '1.0')
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                var data = d3.csvParse(csvdata);
                var ageNames = d3.keys(data[0]).filter((key) => key !== xcol);
                data.forEach(function (d) {
                    d.ages = ageNames.map((name) => ({ name: name, value: +d[name] }));
                });
                x0.domain(data.map(function (d) {
                    return d[xcol];
                }));
                x1.domain(ageNames).rangeRoundBands([0, x0.rangeBand()]);
                y.domain([0, d3.max(data, (d) => {
                        return d3.max(d.ages, (d) => {
                            return d.value;
                        });
                    })]);
                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);
                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text(yaxix_name);
                var state = svg.selectAll("." + xcol)
                    .data(data)
                    .enter().append("g")
                    .attr("class", "g")
                    .attr("transform", function (d) {
                    return "translate(" + x0(d[xcol]) + ",0)";
                });
                state.selectAll("rect")
                    .data(function (d) {
                    return d.ages;
                })
                    .enter().append("rect")
                    .attr("width", x1.rangeBand())
                    .attr("x", function (d) {
                    return x1(d.name);
                })
                    .attr("y", function (d) {
                    return y(d.value);
                })
                    .attr("height", function (d) {
                    return height - y(d.value);
                })
                    .style("fill", function (d) {
                    return color(d.name);
                });
                var legend = svg.selectAll(".legend")
                    .data(ageNames.slice().reverse())
                    .enter().append("g")
                    .attr("class", "legend")
                    .attr("transform", function (d, i) {
                    return "translate(0," + i * 20 + ")";
                });
                legend.append("rect")
                    .attr("x", width - 18)
                    .attr("width", 18)
                    .attr("height", 18)
                    .style("fill", color);
                legend.append("text")
                    .attr("x", width - 24)
                    .attr("y", 9)
                    .attr("dy", ".35em")
                    .style("text-anchor", "end")
                    .text(function (d) {
                    return d;
                });
                var svg_file_name = 'tmp/' + dtnumb + '.svg';
                var png_file_name = 'tmp/' + dtnumb + '.png';
                let svgContent = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n' + d3.select('div#svg' + dtnumb).html();
                fs_1.writeFileSync(svg_file_name, svgContent, { flag: 'w' });
                d3.select('div#svg' + dtnumb).remove();
                //.attr("width", width + margin.left + margin.right)
                //.attr("height", height + margin.top + margin.bottom)
                // svg2png(svg_file_name, png_file_name,
                // {size: (width + margin.left + margin.right)+'px*'+(height + margin.top + margin.bottom)+'px'}, function (err) {
                //     resolve(png_file_name);
                // });
                svg2png(svgContent, {
                    width: (width + margin.left + margin.right),
                    height: height + margin.top + margin.bottom
                })
                    .then(buffer => {
                    fs_1.writeFileSync(png_file_name, buffer);
                    return {
                        img: png_file_name,
                        heading: opts.heading,
                        buffer: buffer
                    };
                })
                    .then(resolve)
                    .catch(reject);
            });
        });
    }
}
exports.CSV = CSV;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ1NWLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0NTVi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFDQSxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDbkMsNEJBQTRCO0FBQzVCLDJCQUFpQztBQUVqQyxNQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFFekI7SUFFSSxZQUFZLElBQVU7UUFDbEIsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSTtZQUN4QixJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVMsR0FBRztnQkFDakIsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBUyxHQUFHO29CQUN4QixNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNwQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDakIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFDSyxNQUFNLENBQUMsSUFBSTs7WUFDYixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxjQUFjLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDbEQsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7WUFDcEIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLE1BQU0sQ0FBQyxTQUFTLENBQUM7WUFDckIsQ0FBQztRQUNMLENBQUM7S0FBQTtJQUNLLFFBQVEsQ0FBQyxJQUFJOztZQUNmLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7WUFDdkIsTUFB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