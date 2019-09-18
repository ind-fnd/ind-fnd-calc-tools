/** 
 * S' -> S
 * S -> E+S|E-S|E
 * E -> t*E|t/E|t
 * t = INTEGER|DOUBLE|COLMN|(S)
*/
// 根据输入，输出解析后的词法单位
var parse = function(i) {
  let lexialTokens = []

  // 当前已解析过的字符索引
  let posi = 0;
  // 操作符正则
  let optReg = /\+|\-|\*|\//;
  // 数字正则
  let numReg = /[0-9\.]/;
  // 变量正则
  let varReg = /[a-zA-z_]/;

  // 分别用于记录遍历的括号开始位置与结束位置数组
  let posiMap = {};
  let startPosis = [];
  let endPosis = [];
  for (let j = 0; j < i.length; j++) {
    if (i[j] == '(') {
      startPosis.push(j);
    } else if (i[j] == ')') {
      endPosis.push(j);
    }
  }
  if (startPosis.length != endPosis.length) {
    throw "非法的输入，括号对不匹配，请校验输入的合法性！";
  } else {
    let len = startPosis.length;
    // startPosis.forEach((n, idx) => {
    //   posiMap[n] = endPosis[len - 1 - idx];
    // })
    for (let lastPosiIdx = len; lastPosiIdx >= 0; lastPosiIdx-- ) {
      let startPosi = startPosis[lastPosiIdx];
      for (let endPosiIdx = 0; endPosiIdx < endPosis.length; endPosiIdx++) {
        let endPosi = endPosis[endPosiIdx];
        // 找到与最右左括号匹配的右括号，维护对应关系，并从数组中删除此右括号的位置
        if (endPosi > startPosi) {
          posiMap[startPosi] = endPosi;
          endPosis.splice(endPosiIdx, 1);
          break;
        }
      }
    }
  }

  var getToken = function(inp) {
    if (i[posi] == ' ') {
      posi += 1;
      return;
    }

    // 匹配到(S)词法开始，需要查找对应结束的符号)
    if ("(" == i[posi]) {
      let endPos = posiMap[posi]
      lexialTokens.push({
        val: parse(i.substring(posi + 1, endPos)),
        type: 'SUB_TOKEN'
      })
      posi = endPos + 1;
    }

    // 这是个操作符
    if (optReg.test(inp[0])) {
      lexialTokens.push({
        val: i[posi],
        type: 'OPT'
      })
      posi += 1;
    } else {
      // 数字
      if (numReg.test(inp[0])) {
        // nl是数字长度
        var nl = 1;
        // 下一个字符还匹配数字
        while (inp.length > nl && numReg.test(inp[nl])) {
          nl += 1;
        }
        lexialTokens.push({
          val: i.substring(posi, posi + nl),
          type: 'NUM'
        })
        posi += nl;
      }
      // 变量
      if (varReg.test(inp[0])) {
        // nl是变量长度
        var nl = 1;
        // 下一个字符还匹配变量
        while (inp.length > nl && (varReg.test(inp[nl]) || numReg.test(inp[nl]))) {
          nl += 1;
        }
        lexialTokens.push({
          val: i.substring(posi, posi + nl),
          type: 'VAR'
        })
        posi += nl;
      }
    }
  }

  // 循环读取词法单位
  while (posi < i.length) {
    getToken(i.substring(posi));
  }
  
  return lexialTokens;
}
// console.log(parse('AA+BB-CC*DD/100'))
// console.log(parse('DIST_COL_H*100/DIST_COL_C'))

// 根据词法单位，产生分析树
var analysis = function(tokens) {
  let astAnalysis = {};
  if (tokens.length == 1) {
    if (tokens[0].type == 'SUB_TOKEN') {
      let tmpAnaRlt = analysis(tokens[0].val)
      tmpAnaRlt.subToken = true;
      astAnalysis = tmpAnaRlt;
    } else {
      astAnalysis.val = tokens[0];
    }
    return astAnalysis;
  }

  let idx = 0;
  for( var i = 0; i < tokens.length; i++ ) {
    if (tokens[i].val == '+' || tokens[i].val == '-') {
      idx = i;
      break;
    }
  }
  if (idx == 0) {
    for( var i = 0; i < tokens.length; i++ ) {
      if (tokens[i].val == '*' || tokens[i].val == '/') {
        idx = i;
        break;
      }
    }
  }

  // 当前的符号 + - * /
  astAnalysis.val = tokens[idx];

  // 等于0说明没有左子树了
  if (idx > 0) {
    astAnalysis.left = analysis(tokens.slice(0, idx));
  }

  // 等于词语长度，说明没有右子树了
  if (idx < tokens.length) {
    astAnalysis.right = analysis(tokens.slice(idx+1, tokens.length));
  }
  return astAnalysis;
}
// console.log(analysis(parse('(DIST_COL_I + DIST_COL_H)*100/DIST_COL_C')))

// 将分析树转换成抽象语法树
// let transAnalysis = (astAnalysis) => {
//   let ast = {};
//   return ast;
// }

// 根据抽象语法树生成想要的结果
var render = function(ast) {
  return traverTree(ast);
}

// 中序遍历一个语法树
var traverTree = function(t) {
  if (!t) {
    return '';
  }
  let val = '';
  if (t.val.type == 'NUM') {
    val = t.val.val;
  } else if (t.val.type == 'OPT') {
    val = ' ' + t.val.val + ' ';
  } else {
    val = 'rowData.' + t.val.val;
  }
  if (t.subToken) {
    return `(${traverTree(t.left) + val + traverTree(t.right)})`
  } else {
    return traverTree(t.left) + val + traverTree(t.right);
  }
}

// 中序遍历一个语法树
var traverTreeCalc = function(t, dataContext) {
  if (!t) {
    return '';
  }
  let val = '';
  if (t.val.type == 'NUM') {
    return parseFloat(t.val.val);
  } else if (t.val.type == 'OPT') {
    var rltTmp;
    switch(t.val.val){
      case '+': 
        rltTmp = traverTreeCalc(t.left, dataContext) + traverTreeCalc(t.right, dataContext);
        break;
      case '-': 
        rltTmp = traverTreeCalc(t.left, dataContext) - traverTreeCalc(t.right, dataContext);
        break;
      case '*': 
        rltTmp = traverTreeCalc(t.left, dataContext) * traverTreeCalc(t.right, dataContext);
        break;
      case '/': {
        var vTmp = traverTreeCalc(t.right, dataContext)
        if (vTmp == 0) {
          throw 'dividzero'
        } else {
          rltTmp = traverTreeCalc(t.left, dataContext) / vTmp;
        }
        break;
      }
    }
    return rltTmp;
  } else {
    return dataContext[t.val.val];
  }
}

// console.log(render(analysis(parse('(DIST_COL_I + DIST_COL_H)*100/DIST_COL_C'))))

// 生成抽象语法树
exports.genAst = function(input){
  var ast = analysis(parse(input));
  return ast;
}

// 生产代码
exports.genCode = function(ast) {
  return render(ast);
}

// 完成计算
exports.doCalc = function(ast, data, errRtn) {
  try {
    let rlt = traverTreeCalc(ast, data, errRtn);
    return rlt;
  } catch (err) {
    if (err == 'dividzero') {
      return errRtn
    }
  }
}