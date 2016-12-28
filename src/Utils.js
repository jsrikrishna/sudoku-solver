/**
 * Created by srikrishna on 11/6/16.
 */

var _ = require('underscore');
var exports = module.exports = {};
exports.digits = "123456789";
exports.rows = ['A','B','C','D','E','F','G','H','I'];
exports.cols = ['1','2','3','4','5','6','7','8','9'];

exports.cross = function(A, B){
    var cross = [];
    _.forEach(A, function (a) {
        _.forEach(B, function (b) {
            cross.push(a+b)
        })
    });
    return cross;
};
exports.getUnitList = function (rows, cols) {
    var unitlist = [];
    _.forEach(cols, function (col) {
        unitlist.push(exports.cross(rows, col));
    });
    _.forEach(rows, function (row) {
        unitlist.push(exports.cross(row, cols));
    });
    _.forEach([['A', 'B', 'C'], ['D', 'E', 'F'], ['G', 'H', 'I']], function (row) {
        _.forEach([['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9']], function (col) {
            unitlist.push(exports.cross(row, col))
        })
    });
    return unitlist;
};
exports.doesSquareExistsInUnitList = function (item, list){
    return _.find(list, function (element) { return element == item }) ? true: false
};
exports.getUnitsForAllSquares = function (squares, unitlist) {
    var units = {};
    _.forEach(squares, function (s) {
        units[s] = [];
        _.forEach(unitlist, function (unit) {
            if (exports.doesSquareExistsInUnitList(s, unit))
                units[s].push(unit);
        })
    });
    return units;
};

exports.getPeersForAllSquares = function(squares, units) {
    var peers = {};
    _.forEach(squares, function (s) {
        peers[s] = {};
        _.forEach(units[s], function (unit) {
            _.forEach(unit, function (s2) {
                if(s2 != s) peers[s][s2] = true;
            })
        })
    });
    return peers;
};