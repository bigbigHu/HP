# Mock

## 一、语法规范

  Mock.js 的语法规范包括两部分：

  - 数据模板定义规范（Data Template Definition，DTD）
  - 数据占位符定义规范（Data Placeholder Definition，DPD）

## 二、数据模板定义规范 DTD

  数据模板中的每个属性由 3 部分构成：属性名、生成规则、属性值：

  ```js
  // 属性名   name
  // 生成规则 rule
  // 属性值   value
  'name|rule': value
  ```

  *注意：*

  - `属性名` 和 `生成规则` 之间用竖线 `|` 分隔。
  - `生成规则` 是可选的。
  - `生成规则` 有 `7` 种格式：
    * `'name|min-max': value`
    * `'name|count': value`
    * `'name|min-max.dmin-dmax': value`
    * `'name|min-max.dcount': value`
    * `'name|count.dmin-dmax': value`
    * `'name|count.dcount': value`
    * `'name|+step': value`
  - `生成规则` 的 含义 需要依赖 `属性值的类型` 才能确定。
  - `属性值` 中可以含有 `@占位符`。
  - `属性值` 还指定了最终值的`初始值`和`类型`。


  #### 生成规则和示例：

  - 属性值是字符串 `String`

    * `'name|min-max': string`

      通过重复 `string` 生成一个字符串，重复次数大于等于 `min`，小于等于 `max`。

    * `'name|count': string`

      通过重复 `string` 生成一个字符串，重复次数等于 `count`

  - 属性值是数字 `Number`

    * `'name|+1': number`

      属性值自动加 1，初始值为 `number`

    * `'name|min-max': number`

      生成一个大于等于 `min`、小于等于 `max` 的整数，属性值 `number` 只是用来确定类型

    * `'name|min-max.dmin-dmax': number`

      生成一个浮点数，整数部分大于等于 `min`、小于等于 `max`，小数部分保留 `dmin` 到 `dmax` 位

      ```js
      Mock.mock({
        'number1|1-100.1-10': 1,
        'number2|123.1-10': 1,
        'number3|123.3': 1,
        'number4|123.10': 1.123
      })
      // =>
      {
          "number1": 12.92,
          "number2": 123.51,
          "number3": 123.777,
          "number4": 123.1231091814
      }
      ```

  - 属性值是布尔型 `Boolean`

    * `'name|1': boolean`

      随机生成一个布尔值，值为 `true` 的概率是 `1/2`，值为 `false` 的概率同样是 `1/2`

    * `'name|min-max': value`

      随机生成一个布尔值，值为 `value` 的概率是 `min / (min + max)`，值为 `!value` 的概率是 `max / (min + max)`

  - 属性值是对象 `Object`
    
    * `'name|count': object`

      从属性值 `object` 中随机选取 `count` 个属性。

    * `'name|min-max': object`

      从属性值 `object` 中随机选取 `min` 到 `max` 个属性

  - 属性值是数组 `Array`

    * `'name|1': array`

      从属性值 `array` 中随机选取 `1` 个元素，作为最终值

    * `'name|+1': array`

      从属性值 `array` 中顺序选取 `1` 个元素，作为最终值
    
    * `'name|min-max': array`

      通过重复属性值 `array` 生成一个新数组，重复次数大于等于 `min`，小于等于 `max`

    * `'name|count': array`

      通过重复属性值 `array` 生成一个新数组，重复次数为 `count`

  - 属性值是函数 `Function`
  
    * `'name': function`

      执行函数 `function`，取其返回值作为最终的属性值，函数的上下文为属性 `name` 所在的对象。

  - 属性值是正则表达式 `RegExp`

    * `'name': regexp`

      根据正则表达式 `regexp` 反向生成可以匹配它的字符串。用于生成自定义格式的字符串

      ```js
      Mock.mock({
        'regexp1': /[a-z][A-Z][0-9]/,
        'regexp2': /\w\W\s\S\d\D/,
        'regexp3': /\d{5,10}/
      })
      // =>
      {
          "regexp1": "pJ7",
          "regexp2": "F)\fp1G",
          "regexp3": "561659409"
      }
      ```


## 三、数据占位符定义规范 DPD

  `占位符` 只是在属性值字符串中占个位置，并不出现在最终的属性值中。

  `占位符` 的格式为：

  ```js
  @占位符
  @占位符(参数 [, 参数])
  ```

  *注意：*

  * 用 `@` 来标识其后的字符串是 占位符。
  * `占位符` 引用的是 `Mock.Random` 中的方法。
  * 通过 `Mock.Random.extend()` 来扩展自定义占位符。
  * `占位符` 也可以引用 `数据模板` 中的属性。
  * `占位符` 会优先引用 `数据模板` 中的属性。
  * `占位符` 支持 `相对路径` 和 `绝对路径`。

  ```js
  Mock.mock({
    name: {
      first: '@FIRST',
      middle: '@FIRST',
      last: '@LAST',
      full: '@first @middle @last'
    }
  })
  // =>
  {
    "name": {
      "first": "Charles",
      "middle": "Brenda",
      "last": "Lopez",
      "full": "Charles Brenda Lopez"
    }
  }
  ```

  `Mock.Random` 提供的完整方法（`占位符`）如下：

  | Type    | Method                             |
  | -       | -                                  |
  | Basic   | `boolean`, `natural`, `integer`, `float`, `character`, `string`, `range`, `date`, `time`, `datetime`, `now` |
  | Image   | `image`, `dataImage` |
  | Color   | `color` |
  | Text    | `paragraph`, `sentence`, `word`, `title`, `cparagraph`, `csentence`, `cword`, `ctitle` |
  | Name    | `first`, `last`, `name`, `cfirst`, `clast`, `cname`  |
  | Web     | `url`, `domain`, `email`, `ip`, `tld` |
  | Address | `area`, `region` |
  | Helper  | `capitalize`, `upper`, `lower`, `pick`, `shuffle` |
  | Miscellaneous | `guid`, `id` |


## 四、扩展

  `Mock.Random` 中的方法与数据模板的 `@占位符` 一一对应，在需要时还可以为 `Mock.Random` 扩展方法，然后在数据模板中通过 `@扩展方法` 引用。例如：

  ```js
  Random.extend({
    constellation: function(date) {
      var constellations = ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座']
      return this.pick(constellations)
    }
  })
  Random.constellation()
  // => "水瓶座"
  Mock.mock('@CONSTELLATION')
  // => "天蝎座"
  Mock.mock({
      constellation: '@CONSTELLATION'
  })
  // => { constellation: "射手座" }
  ```


## 五、API

### Mock.mock()

  `Mock.mock( rurl?, rtype?, template|function( options ) )`

  根据数据模板生成模拟数据。

  `Mock.mock( template )`

  根据数据模板生成模拟数据。

  `Mock.mock( rurl, template )`

  记录数据模板。当拦截到匹配 rurl 的 Ajax 请求时，将根据数据模板 template 生成模拟数据，并作为响应数据返回。

  `Mock.mock( rurl, function( options ) )`

  记录用于生成响应数据的函数。当拦截到匹配 rurl 的 Ajax 请求时，函数 function(options) 将被执行，并把执行结果作为响应数据返回。

  `Mock.mock( rurl, rtype, template )`

  记录数据模板。当拦截到匹配 rurl 和 rtype 的 Ajax 请求时，将根据数据模板 template 生成模拟数据，并作为响应数据返回。

  `Mock.mock( rurl, rtype, function( options ) )`

  记录用于生成响应数据的函数。当拦截到匹配 rurl 和 rtype 的 Ajax 请求时，函数 function(options) 将被执行，并把执行结果作为响应数据返回。

  - `rurl`

    可选。

    表示需要拦截的 URL，可以是 URL 字符串或 URL 正则。例如 /\/domain\/list\.json/、'/domian/list.json'。

  - `rtype`

    可选。

    表示需要拦截的 Ajax 请求类型。例如 GET、POST、PUT、DELETE 等。

  - `template`

    可选。

    表示数据模板，可以是对象或字符串。例如 { 'data|1-10':[{}] }、'@EMAIL'。

  - `function(options)`

    可选。

    表示用于生成响应数据的函数。

  - `options`
  
    指向本次请求的 Ajax 选项集，含有 url、type 和 body 三个属性，参见 XMLHttpRequest 规范。

### Mock.setup()

  `Mock.setup( settings )`

  配置拦截 Ajax 请求时的行为。支持的配置项有：timeout。

  `settings`

  必选。

  配置项集合。

  - `timeout`

    可选。

    指定被拦截的 Ajax 请求的响应时间，单位是毫秒。值可以是正整数，例如 400，表示 400 毫秒 后才会返回响应内容；也可以是横杠 '-' 风格的字符串，例如 '200-600'，表示响应时间介于 200 和 600 毫秒之间。默认值是'10-100'。

    ```js
    Mock.setup({
        timeout: 400
    })
    Mock.setup({
        timeout: '200-600'
    })
    ```

### Mock.Random

  `Mock.Random` 是一个工具类，用于生成各种随机数据

  `Mock.Random` 的方法在数据模板中称为『占位符』，书写格式为 `@占位符(参数 [, 参数])`

  ```js
  var Random = Mock.Random
  Random.email()
  // => "n.clark@miller.io"
  Mock.mock('@email')
  // => "y.lee@lewis.org"
  Mock.mock( { email: '@email' } )
  // => { email: "v.lewis@hall.gov" }
  ```
