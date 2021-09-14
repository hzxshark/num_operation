## num_operation

[![Build Status](https://app.travis-ci.com/hzxshark/num_operation.svg?branch=master)](https://app.travis-ci.com/hzxshark/num_operation) [![Coverage Status](https://coveralls.io/repos/github/hzxshark/num_operation/badge.svg?branch=master)](https://coveralls.io/github/hzxshark/num_operation?branch=master)

>> 解决js运算浮点数的问题

### 安装

```js
npm i num_operation --save
```

### 使用

```js
import { plus, minus, times, divide, digitToCNchar } from 'num_operation';

/** 加法 */
plus(0.1, 0.2)  // 0.3

/** 减法 */
minus(0.1, 0.2) // -0.1

/** 乘法 */
times(0.1, 0.2) // 0.02

/** 除法 */
divide(0.1, 0.2) // 0.5

/** 数字转中文大写 */
digitToCNchar(12.5) // 壹拾贰元伍角

```


