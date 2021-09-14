
type numType = number | string;
/**
 * @desc 解决浮动运算问题，避免小数点后产生多位数和计算精度损失。
 * 问题示例：2.3 + 2.4 = 4.699999999999999，1.0 - 0.9 = 0.09999999999999998
 */

/**
 * 把错误的数据转正
 * strip(0.09999999999999998)=0.1
 */
function strip(num: numType, precision = 15): number {
  return +parseFloat(Number(num).toPrecision(precision));
}

/**
 * Return digits length of a number
 * @param {*number} num Input number
 */
function digitLength(num: numType): number {
  const eSplit = num.toString().split(/[eE]/);
  const len = (eSplit[0].split('.')[1] || '').length - +(eSplit[1] || 0);
  return len > 0 ? len : 0;
}

/**
 * 把小数转成整数，支持科学计数法。如果是小数则放大成整数
 * @param {*number} num 输入数
 */
function float2Fixed(num: numType): number {
  if (num.toString().indexOf('e') === -1) {
    return Number(num.toString().replace('.', ''));
  }
  const dLen = digitLength(num);
  return dLen > 0 ? strip(Number(num) * Math.pow(10, dLen)) : Number(num);
}

/**
 * 检测数字是否越界，如果越界给出提示
 * @param {*number} num 输入数
 */
function checkBoundary(num: number) {
  if (_boundaryCheckingState) {
    // @ts-ignore
    if (num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) {
      console.warn(`${num} is beyond boundary when transfer to integer, the results may not be accurate`);
    }
  }
}

/**
 * 迭代操作
 */
function iteratorOperation(arr: numType[], operation: (...args: numType[]) => number): number {
  const [num1, num2, ...others] = arr;
  let res = operation(num1, num2);

  others.forEach((num) => {
    res = operation(res, num);
  });

  return res;
}

/**
 * 精确乘法
 */
function times(...nums: numType[]): number {
  if (nums.length > 2) {
    return iteratorOperation(nums, times);
  }

  const [num1, num2] = nums;
  const num1Changed = float2Fixed(num1);
  const num2Changed = float2Fixed(num2);
  const baseNum = digitLength(num1) + digitLength(num2);
  const leftValue = num1Changed * num2Changed;

  checkBoundary(leftValue);

  return leftValue / Math.pow(10, baseNum);
}

/**
 * 精确加法
 */
function plus(...nums: numType[]): number {
  if (nums.length > 2) {
    return iteratorOperation(nums, plus);
  }

  const [num1, num2] = nums;
  // 取最大的小数位
  const baseNum = Math.pow(10, Math.max(digitLength(num1), digitLength(num2)));
  // 把小数都转为整数然后再计算
  return (times(num1, baseNum) + times(num2, baseNum)) / baseNum;
}

/**
 * 精确减法
 */
function minus(...nums: numType[]): number {
  if (nums.length > 2) {
    return iteratorOperation(nums, minus);
  }

  const [num1, num2] = nums;
  const baseNum = Math.pow(10, Math.max(digitLength(num1), digitLength(num2)));
  return (times(num1, baseNum) - times(num2, baseNum)) / baseNum;
}

/**
 * 精确除法
 */
function divide(...nums: numType[]): number {
  if (nums.length > 2) {
    return iteratorOperation(nums, divide);
  }

  const [num1, num2] = nums;
  const num1Changed = float2Fixed(num1);
  const num2Changed = float2Fixed(num2);
  checkBoundary(num1Changed);
  checkBoundary(num2Changed);
  // fix: 类似 10 ** -4 为 0.00009999999999999999，strip 修正
  return times(num1Changed / num2Changed, strip(Math.pow(10, digitLength(num2) - digitLength(num1))));
}

/**
 * 四舍五入
 */
function round(num: numType, ratio: number): number {
  const base = Math.pow(10, ratio);
  let result = divide(Math.round(Math.abs(times(num, base))), base);
  if (num < 0 && result !== 0) {
    result = times(result, -1);
  }
  return result;
}

function digitToCNchar(money: number): string{
  const digit = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖" ];
  const declmalUtil = ["角", "分"];
  const IntUtilExc = ["元", "万", "亿", "兆"];
  const IntUtilBac = ["", "拾", "佰", "仟"];
  const head = money < 0 ? "负" : "";
  money = Math.abs(money);
  let res = "";
  //处理小数
  for(let i = 0;i<declmalUtil.length;i++){
    let a = Math.pow(10,i+1);
    a= Math.floor(times(a,money))%10;
    res += (digit[a]+declmalUtil[i]).replace(/(零.)+/,'');
  }
  if (res.length < 1) {
    res = "整";
  }
  //处理整数部分
  let IntPart = Math.floor(money);
  for(let i = 0;i<IntUtilExc.length&&IntPart>0;i++){
    let part ="";
    for(let j=0;j<IntUtilBac.length;j++){
          let a = IntPart%10;
          IntPart = Math.floor(IntPart/10);
          part = digit[a]+IntUtilBac[j]+part;
    }
    res = part+IntUtilExc[i]+res;
  }
  res=res.replace(/(零[拾佰仟])*零元/,"元");
  res=res.replace(/^(零.)+/,"");
  res=res.replace(/(零[拾佰仟])+/g,"零");
  res=res.replace(/零([万亿兆])+/g,"$1");
  res=res.replace(/零([万亿兆])+/g,"");
  res=res.replace(/^整$/, "零元整");
  return head+res;
}

let _boundaryCheckingState = true;
/**
 * 是否进行边界检查，默认开启
 * @param flag 标记开关，true 为开启，false 为关闭，默认为 true
 */
function enableBoundaryChecking(flag = true) {
  _boundaryCheckingState = flag;
}
export { strip, plus, minus, times, divide, round, digitLength, float2Fixed, digitToCNchar, enableBoundaryChecking };
export default {
  strip,
  plus,
  minus,
  times,
  divide,
  round,
  digitLength,
  float2Fixed,
  digitToCNchar,
  enableBoundaryChecking,
};