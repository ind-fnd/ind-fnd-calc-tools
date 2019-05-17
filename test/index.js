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
    rule: 'DIST_COL_F/DIST_COL_C*100-DIST_COL_D/DIST_COL_C*100', 
    precision: 2 
  },
  {
    rltKey: "r4", 
    rule: 'DIST_COL_H*100/DIST_COL_C', 
    precision: 2 
  }
]

console.log(data)
console.time('calc')
CalcTool.calcDatas(data,{calcRules: rules});
console.log(data)
console.timeEnd('calc')