var CalcUtil = require('./calc')

/** 接收参数 datas, options
 * options {calcRules: [{rltKey: keyn1, rule: key2/key3, precision: 2}]}
 * 返回处理后的新数据
 */
exports.calcDatas = function(datas, options){
  var astHash = {};
  var precisionHash = {};

  // 开始表演
  if (options && options.calcRules) {
    options.calcRules.forEach(n => {
      astHash[n.rltKey] = CalcUtil.genAst(n.rule);
      precisionHash[n.rltKey] = n.precision || 0;
    });

    console.log(astHash)
    console.log(precisionHash)

    datas.forEach(d => {
      Object.keys(astHash).forEach(k => {
        d[k] = CalcUtil.doCalc(astHash[k], d);
        if (isNaN(d[k])) {
          d[k] = '-';
          return;
        }
        if (precisionHash[k]) {
          d[k] = !!d[k] ? d[k].toFixed(precisionHash[k]) : d[k];
        } else {
          d[k] = parseInt(d[k]);
        }
      })
    })
  }
}