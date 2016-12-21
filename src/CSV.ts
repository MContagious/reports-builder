
const svg2png = require('svg2png');
// const fs = require('fs');
import {writeFileSync} from 'fs';
import {scaleOrdinal} from 'd3';
const d3 = require('d3');

export class CSV {
    csv:string;
    constructor(rows:any[]) {
        let cols = Object.keys(rows[0]);
        this.csv = cols.join(',') + "\n" +
                rows.map(function(row) {
                    return cols.map(function(col){
                        return row[col];
                    }).join(',');
                }).join('\n');
    }
    async getCSV(opts):Promise<string|undefined> {
        if (opts.Attachment && opts.AttachmentType == 'CSV') {
            return this.csv;
        } else {
            return undefined;
        }
    }
    async getGraph(opts) {
        let csvdata = this.csv;
        return new Promise<{img, heading, buffer}>((resolve, reject) => {
            if (!opts.heading) {
                return resolve(undefined);
            }
            var dtnumb:number = +(new Date());
            
            var margin = {top: 20, right: 20, bottom: 30, left: 40},
                org_width = (csvdata.split('\n').length-1)*60+margin.left+25+margin.right,
                width = org_width - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom;
            var cols = opts.cols || csvdata.split('\n')[0].split(',');
            var xcol = cols[0];
            var yaxix_name = opts.yaxis_name || 'Name for Y-Axis';
            var x0 = d3.scaleBand()
                .rangeRound([0, width-18])
                .padding(.1);

            var x1 = d3.scaleOrdinal();

            var y = d3.scaleLinear()
                .range([height, 0]);

            var color = d3.scaleOrdinal()
                .range(["#ff6262", "#62ff62", "#6262ff", "#ff8c00", "#970097", "#77c8a2", "#edf549"]);

            var xAxis = d3.axisBottom()
                .scale(x0)

            var yAxis = d3.axisLeft()
                .scale(y)
                .tickFormat(d3.format(".2s"));

            let svg = d3.select("body").append('div').attr('id', 'svg'+dtnumb)
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
                d.ages = ageNames.map((name) => ({name: name, value: +d[name]}));
            });

            x0.domain(data.map(function (d) {
                return d[xcol];
            }));

            x1.domain(ageNames).rangeRoundBands([0, x0.rangeBand()]);
            y.domain([0, d3.max(data, (d) => {
                return d3.max(d.ages,  (d) => {
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

            var state = svg.selectAll("."+xcol)
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
            let svgContent =  '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n' + d3.select('div#svg'+dtnumb).html();
            writeFileSync(svg_file_name,svgContent, {flag: 'w'});
            d3.select('div#svg'+dtnumb).remove();
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
                writeFileSync(png_file_name, buffer);
                return {
                    img: png_file_name,
                    heading: opts.heading,
                    buffer: buffer
                };
            })
            .then(resolve)
            .catch(reject);    
        });
    }
}