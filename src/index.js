var CalcUtil = require('./calc')

/** 接收参数 datas, options
 * options {
 *  calcRules: [
 *    {
 *      rltKey: keyn1, // 处理结果的属性名
 *      rule: key2/key3, // 处理的表达式
 *      precision: 2, // 精度
 *      errRtn: '-' // 除零等异常发生后返回的数据
 *    }
 *  ]
 * }
 * 返回处理后的新数据
 */
exports.calcDatas = function(datas, options){
  var astHash = {};
  var precisionHash = {};
  var errRtnHash = {};

  // 开始表演
  if (options && options.calcRules) {
    options.calcRules.forEach(n => {
      astHash[n.rltKey] = CalcUtil.genAst(n.rule);
      precisionHash[n.rltKey] = n.precision || 0;
      errRtnHash[n.rltKey] = n.errRtn || 0;
    });

    datas.forEach(d => {
      Object.keys(astHash).forEach(k => {
        d[k] = CalcUtil.doCalc(astHash[k], d, errRtnHash[k]);
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