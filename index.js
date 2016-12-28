/**
 * Created by srikrishna on 11/6/16.
 */

var _ = require('lodash');
var utils = require('./Utils.js');

function setDefaultValuesForAllSquares(squares, digits) {
    var values = {};
    _.forEach(squares, function (s) {
       values[s] = digits
    });
    return values;
}
var squares = utils.cross(utils.rows, utils.cols);
var nassigns = 0;
var neliminations = 0;
var nsearches = 0;
var units = utils.getUnitsForAllSquares(squares, utils.getUnitList(utils.rows, utils.cols));
var peers = utils.getPeersForAllSquares(squares, units);

function parse_grid(grid){
    nassigns = 0;
    neliminations = 0;
    nsearches = 0;
    var grid2 = "";
    _.forEach(grid, function (sqVal) {
        if(utils.digits.indexOf(sqVal) != -1) grid2 += sqVal;
        else grid2 += 0
    });
    var values = setDefaultValuesForAllSquares(squares, utils.digits);
    _.forEach(squares, function (s, index) {
       if (utils.digits.indexOf(grid.charAt(index)) != -1 && !assign(values, s, grid2.charAt(index))) return false;
    });
    return values;
}

function assign(values, sq, dig){ // Eliminate all the other values (except dig) from values[sq] and propagate.
    ++nassigns;
    var result = true;
    var sqVals = values[sq];
    _.forEach(sqVals, function (sqVal) { if(sqVal != dig) result &= (eliminate(values, sq, sqVal) ? true : false) });
    return (result ? values : false);
}

function eliminate(values, sq, dig){
    ++neliminations;
    if (values[sq].indexOf(dig) == -1) return values;
    values[sq] = values[sq].replace(dig, "");
    if (values[sq].length == 0) return false;
    if(values[sq].length == 1){
        var res = true;
        _.forEach(Object.keys(peers[sq]), function (peerSq) {
            res &= (eliminate(values, peerSq, values[sq]) ? true : false)
        });
        if(!res) return false;
    }
    _.forEach(units[sq], function (unit) {
       var possibleSquaresForDig = [];
        _.forEach(unit, function (sq2) {
           if(values[sq2].indexOf(dig) != -1) possibleSquaresForDig.push(dig)
        });
        if(possibleSquaresForDig.length == 0 ||
            possibleSquaresForDig.length ==1 && !assign(values, possibleSquaresForDig[0], dig)) return false;
    });
    return values;
}

function search(values){
    ++nsearches;
    if (!values) return false;

    var min = 10, max = 1, sq = null;
    for (var s in squares){
        if (values[squares[s]].length > max)
            max = values[squares[s]].length;
        if (values[squares[s]].length > 1 && values[squares[s]].length < min){
            min = values[squares[s]].length;
            sq = squares[s];
        }
    }
    if (max == 1) return values;
    for (var d = 0; d < values[sq].length; d++){
        var res = search(assign(Object.assign({}, values), sq, values[sq].charAt(d)));
        if (res) return res;
    }
    return false;
}

function runSudoku() {


    var puzzleInput = '';
    var regex = new RegExp(',', 'g');
    var lineReader = require('line-reader');
    lineReader.eachLine('input.txt', function(line, last) {
        // console.log('file line: ' +  line + ' puzzleInput is ' + puzzleInput);
        puzzleInput = puzzleInput + line.replace(regex, '');
        if(last){
            console.time('Solving Sudoku took');
            isSolutionFound = search(parse_grid(puzzleInput));
            console.timeEnd('Solving Sudoku took');
            if(!isSolutionFound) {
                console.log('Solution not found')
            } else {
                if(typeof isSolutionFound === "object") {
                    console.log('No.of Nodes pruned are ' + neliminations);
                    console.log('No.of Assignments are ' + nassigns);
                    console.log('No.of Backtracks are ' + nsearches);
                    console.log('Solution found' + JSON.stringify((_.values(isSolutionFound)).join('')));
                }
            }
        }
    })
}
runSudoku();
