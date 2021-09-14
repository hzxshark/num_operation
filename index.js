"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enableBoundaryChecking = exports.digitToCNchar = exports.float2Fixed = exports.digitLength = exports.round = exports.divide = exports.times = exports.minus = exports.plus = exports.strip = void 0;
/**
 * @desc 解决浮动运算问题，避免小数点后产生多位数和计算精度损失。
 * 问题示例：2.3 + 2.4 = 4.699999999999999，1.0 - 0.9 = 0.09999999999999998
 */
/**
 * 把错误的数据转正
 * strip(0.09999999999999998)=0.1
 */
function strip(num, precision) {
    if (precision === void 0) { precision = 15; }
    return +parseFloat(Number(num).toPrecision(precision));
}
exports.strip = strip;
/**
 * Return digits length of a number
 * @param {*number} num Input number
 */
function digitLength(num) {
    var eSplit = num.toString().split(/[eE]/);
    var len = (eSplit[0].split('.')[1] || '').length - +(eSplit[1] || 0);
    return len > 0 ? len : 0;
}
exports.digitLength = digitLength;
/**
 * 把小数转成整数，支持科学计数法。如果是小数则放大成整数
 * @param {*number} num 输入数
 */
function float2Fixed(num) {
    if (num.toString().indexOf('e') === -1) {
        return Number(num.toString().replace('.', ''));
    }
    var dLen = digitLength(num);
    return dLen > 0 ? strip(Number(num) * Math.pow(10, dLen)) : Number(num);
}
exports.float2Fixed = float2Fixed;
/**
 * 检测数字是否越界，如果越界给出提示
 * @param {*number} num 输入数
 */
function checkBoundary(num) {
    if (_boundaryCheckingState) {
        // @ts-ignore
        if (num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) {
            console.warn(num + " is beyond boundary when transfer to integer, the results may not be accurate");
        }
    }
}
/**
 * 迭代操作
 */
function iteratorOperation(arr, operation) {
    var num1 = arr[0], num2 = arr[1], others = arr.slice(2);
    var res = operation(num1, num2);
    others.forEach(function (num) {
        res = operation(res, num);
    });
    return res;
}
/**
 * 精确乘法
 */
function times() {
    var nums = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        nums[_i] = arguments[_i];
    }
    if (nums.length > 2) {
        return iteratorOperation(nums, times);
    }
    var num1 = nums[0], num2 = nums[1];
    var num1Changed = float2Fixed(num1);
    var num2Changed = float2Fixed(num2);
    var baseNum = digitLength(num1) + digitLength(num2);
    var leftValue = num1Changed * num2Changed;
    checkBoundary(leftValue);
    return leftValue / Math.pow(10, baseNum);
}
exports.times = times;
/**
 * 精确加法
 */
function plus() {
    var nums = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        nums[_i] = arguments[_i];
    }
    if (nums.length > 2) {
        return iteratorOperation(nums, plus);
    }
    var num1 = nums[0], num2 = nums[1];
    // 取最大的小数位
    var baseNum = Math.pow(10, Math.max(digitLength(num1), digitLength(num2)));
    // 把小数都转为整数然后再计算
    return (times(num1, baseNum) + times(num2, baseNum)) / baseNum;
}
exports.plus = plus;
/**
 * 精确减法
 */
function minus() {
    var nums = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        nums[_i] = arguments[_i];
    }
    if (nums.length > 2) {
        return iteratorOperation(nums, minus);
    }
    var num1 = nums[0], num2 = nums[1];
    var baseNum = Math.pow(10, Math.max(digitLength(num1), digitLength(num2)));
    return (times(num1, baseNum) - times(num2, baseNum)) / baseNum;
}
exports.minus = minus;
/**
 * 精确除法
 */
function divide() {
    var nums = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        nums[_i] = arguments[_i];
    }
    if (nums.length > 2) {
        return iteratorOperation(nums, divide);
    }
    var num1 = nums[0], num2 = nums[1];
    var num1Changed = float2Fixed(num1);
    var num2Changed = float2Fixed(num2);
    checkBoundary(num1Changed);
    checkBoundary(num2Changed);
    // fix: 类似 10 ** -4 为 0.00009999999999999999，strip 修正
    return times(num1Changed / num2Changed, strip(Math.pow(10, digitLength(num2) - digitLength(num1))));
}
exports.divide = divide;
/**
 * 四舍五入
 */
function round(num, ratio) {
    var base = Math.pow(10, ratio);
    var result = divide(Math.round(Math.abs(times(num, base))), base);
    if (num < 0 && result !== 0) {
        result = times(result, -1);
    }
    return result;
}
exports.round = round;
function digitToCNchar(money) {
    var digit = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
    var declmalUtil = ["角", "分"];
    var IntUtilExc = ["元", "万", "亿", "兆"];
    var IntUtilBac = ["", "拾", "佰", "仟"];
    var head = money < 0 ? "负" : "";
    money = Math.abs(money);
    var res = "";
    //处理小数
    for (var i = 0; i < declmalUtil.length; i++) {
        var a = Math.pow(10, i + 1);
        a = Math.floor(times(a, money)) % 10;
        res += (digit[a] + declmalUtil[i]).replace(/(零.)+/, '');
    }
    if (res.length < 1) {
        res = "整";
    }
    //处理整数部分
    var IntPart = Math.floor(money);
    for (var i = 0; i < IntUtilExc.length && IntPart > 0; i++) {
        var part = "";
        for (var j = 0; j < IntUtilBac.length; j++) {
            var a = IntPart % 10;
            IntPart = Math.floor(IntPart / 10);
            part = digit[a] + IntUtilBac[j] + part;
        }
        res = part + IntUtilExc[i] + res;
    }
    res = res.replace(/(零[拾佰仟])*零元/, "元");
    res = res.replace(/^(零.)+/, "");
    res = res.replace(/(零[拾佰仟])+/g, "零");
    res = res.replace(/零([万亿兆])+/g, "$1");
    res = res.replace(/零([万亿兆])+/g, "");
    res = res.replace(/^整$/, "零元整");
    return head + res;
}
exports.digitToCNchar = digitToCNchar;
var _boundaryCheckingState = true;
/**
 * 是否进行边界检查，默认开启
 * @param flag 标记开关，true 为开启，false 为关闭，默认为 true
 */
function enableBoundaryChecking(flag) {
    if (flag === void 0) { flag = true; }
    _boundaryCheckingState = flag;
}
exports.enableBoundaryChecking = enableBoundaryChecking;
exports.default = {
    strip: strip,
    plus: plus,
    minus: minus,
    times: times,
    divide: divide,
    round: round,
    digitLength: digitLength,
    float2Fixed: float2Fixed,
    digitToCNchar: digitToCNchar,
    enableBoundaryChecking: enableBoundaryChecking,
};
