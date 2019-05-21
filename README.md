# ind-fnd-calc-tools
## 计算的小工具，会越来越完善

### 应用场景
- 系统级别配置计算规则表|文件，每个功能选择需要使用的计算规则，应用此工具进行业务计算
  - 仅适用于确切的规则，对不同业务场景使用不同计算规则的，需要分开定义
  - 可以将计算规则逻辑从代码中提取出去，一方面省略计算的代码，一方面避免手写出错
  - 系统级别的计算规则与实际代码隔离，更加清晰，更易于维护和查看
  - 经本级node环境测试，1w行数据的处理时间为124ms，性能方面在传统行业业务领域可以接受
- 代码机中生成需要遍历处理结果集的计算代码

### 使用方法（未开发java版本，如有需要，请fork之后自行修改）
```
/** 接收参数 datas, options
 * options {
 *  calcRules: [
 *    {
 *      rltKey: 'UNDONE_RATE', // 处理结果的属性名
 *      rule: '(ALL_COUNT - DONE_COUNT) / ALL_COUNT', // 处理的表达式，目前仅支持由[a-zA-Z_]组成的属性列
 *      precision: 2, // 精度
 *      errRtn: '-' // 除零等异常发生后返回的数据
 *    }
 *  ]
 * }
 * 返回处理后的新数据
 */

// 使用
var CalcTool = require('ind-fnd-calc-tools');

var data = []; // 原始数据数组，可以是从服务器返回的业务数据

// 一些定义的运算的规则
var rules = [
  {
    rltKey: "RATE1", 
    rule: 'DIST_COL_F*100.00/DIST_COL_C-DIST_COL_D*100.00/DIST_COL_C', 
    precision: 2,
    errRtn: '-'
  },
  {
    rltKey: "RATE2", 
    precision: 2,
    errRtn: '-',
    rule: '(DIST_COL_H+DIST_COL_I)*100.00/DIST_COL_C'
  }
]

// 将按照运算规则，处理原始数据
CalcTool.calcDatas(data,{calcRules: rules});
```
