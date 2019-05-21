var CalcTool = require('../src/index.js')

var data = [];
for(var i = 0; i < 100; i++) {
  var d = {};
  d.DIST_COL_A = Math.random()*50 + 50;
  d.DIST_COL_B = Math.random()*50 + 50;
  d.DIST_COL_C = Math.random()*50 + 50;
  d.DIST_COL_D = Math.random()*50 + 50;
  d.DIST_COL_E = Math.random()*50 + 50;
  d.DIST_COL_F = Math.random()*50 + 50;
  d.DIST_COL_G = Math.random()*50 + 50;
  d.DIST_COL_H = Math.random()*50 + 50;
  d.DIST_COL_I = Math.random()*50 + 50;
  data.push(d);
}

var rules = [
  {
    rltKey: "r3", 
    rule: 'DIST_COL_F*100.00/DIST_COL_C-DIST_COL_D*100.00/DIST_COL_C', 
    precision: 2 
  },
  {
    rltKey: "r4", 
    precision: 2,
    rule: 'DIST_COL_H+DIST_COL_I'
  },
  {
    rltKey: "r5", 
    precision: 2,
    rule: '(DIST_COL_H+DIST_COL_I)*100.00'
  },
  {
    rltKey: "r6", 
    precision: 2,
    rule: '(DIST_COL_H+DIST_COL_I)*100.00/0'
  }
]

// console.log(data)
console.time('calc')
CalcTool.calcDatas(data,{calcRules: rules, errRtn: '-'});
console.log(data)
console.timeEnd('calc')