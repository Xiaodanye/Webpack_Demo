## [webpack](https://webpack.docschina.org/)

本质上，**webpack** 是一个用于现代 JavaScript 应用程序的 **静态模块打包工具**。当 webpack 处理应用程序时，它会在内部从一个或多个入口点构建一个 [依赖图(dependency graph)](https://webpack.docschina.org/concepts/dependency-graph/)，然后将你项目中所需的每一个模块组合成一个或多个 *bundles*，它们均为静态资源，用于展示你的内容。

![](/Users/fjp_xiaoye999/Desktop/FJP/工作/知识图谱/webpack.png)

---

### 基本概念

#### 作用

webpack 的作用其实有以下几点：

- **模块打包（核心）**：可以将不同模块的文件打包整合在一起，并且保证它们之间的引用正确，执行有序。利用打包我们就可以在开发的时候根据我们自己的业务自由划分文件模块，保证项目结构的清晰和可读性。
- **编译兼容（loader）**：通过 webpack 的`Loader`机制，不仅仅可以帮助我们对代码做polyfill（补丁），还可以编译转换诸如 .less, .vue, .jsx 这类在浏览器无法识别的格式文件，让我们在开发的时候可以使用新特性和新语法做开发，不需要太多的考虑浏览器兼容代码，提高开发效率。
- **能力扩展（plugin）**：通过 webpack 的`Plugin`机制，可以进一步实现诸如按需加载，代码压缩等一系列功能，帮助我们进一步提高自动化程度，工程效率以及打包输出的质量。

---

#### 核心

webpack 的配置是通过 **webpack.config.js** 这个文件来实现的，其中有五个核心概念：

- **entry（入口）**：指示 Webpack 从哪个文件开始打包
- **output（输出）**：指示 Webpack 打包完的文件输出到哪里去，如何命名等
- **loader（加载器）**：通过借助第三方 loader 来解析webpack自身无法解析的资源
- **plugins（插件）**：扩展 Webpack 的功能（按需加载，代码压缩等）
- **mode（模式）**：development（开发） | production（生产）

---

#### 开发模式 & 生产模式

**开发模式**顾名思义就是我们开发代码时使用的模式，这个模式下我们主要做两件事：

1. 编译代码，使浏览器能识别运行（loader）
2. 代码质量检查，树立代码规范（Eslint）

> **开发服务器&自动化：webpack-dev-server**
>
> 当使用 `webpack serve` 运行指令，所有代码都会在内存中编译打包，并不会输出到 dist 目录下。

**生产模式**是开发完成代码后，我们需要得到代码将来部署上线，这个模式下我们主要对代码进行优化，让其运行性能更好。优化主要从两个角度出发:

1. 优化代码运行性能
2. 优化代码打包速度

---

#### loader & plugin

webpack 只能理解 JavaScript 和 JSON 文件，这是 webpack 开箱可用的自带能力。

**[loader](https://webpack.docschina.org/loaders/)** 用于对模块的源代码进行转换（翻译）。loader 可以使你在 `import` 或 "load(加载)" 模块时预处理文件。将文件从不同的语言（如 TypeScript）转换为 JavaScript 或将内联图像转换为 data URL，以供应用程序使用。

`module.rules` 允许你在 webpack 配置中指定多个 loader，多个 loader 从右到左（或从下到上）地取值(evaluate)/执行(execute)

<table>
  <tr>
    <th>资源相关</th>
    <th>loader</th>
    <th>功能介绍</th>
  </tr>
  <tr>
    <td rowspan='6'>样式</td>
    <td>style-loader</td>
    <td>会动态创建一个 Style 标签，里面放置 Webpack 中 Css 模块内容</td>
  </tr>
  <tr>
    <td>css-loader</td>
    <td>负责将 Css 文件编译成 Webpack 能识别的模块</td>
  </tr>
    <tr>
    <td>postcss-loader、postcss、postcss-preset-env</td>
    <td>Css兼容性处理</td>
  </tr>
  <tr>
    <td>less-loader</td>
    <td>负责将 Less 文件编译成 Css 文件</td>
  </tr>
  <tr>
    <td>sass-loader、sass</td>
    <td>负责将 Sass 文件编译成 Css 文件</td>
  </tr>
  <tr>
    <td>stylus-loader</td>
    <td>负责将 Styl 文件编译成 Css 文件</td>
  </tr>
  <tr>
    <td rowspan='2'>图片</td>
    <td>file-loader（默认）</td>
    <td>打包处理图片文件</td>
  </tr>
  <tr>
    <td>url-loader（默认）</td>
    <td>以base64编码的URL加载图片文件</td>
  </tr>
  <tr>
    <td rowspan='2'>JavaScript</td>
    <td>babel-loader</td>
    <td>加载 ES6 代码并将其转换为 ES5</td>
  </tr>
  <tr>
    <td>thread-loader</td>
    <td>开启多进程打包</td>
  </tr>
</table>

**[plugin](https://webpack.docschina.org/plugins/)** 插件目的在于解决 [loader](https://webpack.docschina.org/concepts/loaders) 无法实现的其他事，扩展 webpack 能力。

想要使用一个插件，你只需要安装并 `require()` 它，然后把它添加到 plugins 数组中。多数插件可以通过选项(option)自定义。你也可以在一个配置文件中因为不同目的而多次使用同一个插件，这时需要通过使用 new 操作符来创建一个插件实例。

| plugin                            | 功能介绍                               |
| --------------------------------- | -------------------------------------- |
| html-webpack-plugin、 html-loader | 简化 HTML 文件创建                     |
| eslint-webpack-plugin、eslint     | 根据规则对代码进行检查                 |
| mini-css-extract-plugin           | 将 CSS 提取到单独的文件中              |
| css-minimizer-webpack-plugin      | 使用 cssnano 优化和压缩 CSS            |
| speed-measure-webpack-plugin      | 可以看到每个 Loader 和 Plugin 执行耗时 |
| webpack-bundle-analyzer           | 可视化 Webpack 输出文件的体积          |
| ModuleConcatenationPlugin         | 开启 Scope Hoisting                    |

---

`type: "asset/resource"`和`type: "asset"`的区别：

1. `type: "asset/resource"` 相当于`file-loader`, 将文件转化成 Webpack 能识别的资源，其他不做处理
2. `type: "asset"` 相当于`url-loader`, 将文件转化成 Webpack 能识别的资源，同时小于某个大小的资源会处理成 data URI 形式

---

### 原理探讨

#### webpack构建/打包流程

Webpack 的运行流程是一个串行的过程，从启动到结束会依次执行以下流程：

1. 读取`webpack`的配置参数；
2. 启动`webpack`，创建`Compiler`对象并开始解析项目；
3. 从入口文件（`entry`）开始解析，并且找到其导入的依赖模块，递归遍历分析，形成依赖关系树；
4. 对不同文件类型的依赖模块文件使用对应的`Loader`进行编译，最终组合成 `Chunk`；
5. 将 `Chunk` 转换成 `bundle` 文件，根据配置确定输出的路径和文件名，把文件内容写入到文件系统；
6. 整个过程中`webpack`会通过发布订阅模式，向外抛出一些`hooks`，而`webpack`的插件`plugins`即可通过监听这些关键的事件节点，执行插件任务进而达到干预输出结果的目的。

简单来说：初始化 => 编译 => 输出

---

#### webpack构建优化

##### 1、提升开发体验

**SourceMap**：`sourceMap` 是将编译、打包、压缩后的代码映射回源代码的过程。它会生成一个 xxx.map 文件，构建后代码出错了，会通过 xxx.map 文件，从构建后代码出错位置找到映射后源代码出错位置，从而让浏览器提示源代码文件出错位置，帮助我们更快的找到错误根源。正常情况下只要不打开开发者工具，浏览器是不会加载map映射文件的。

- 开发模式：`cheap-module-source-map`
- 生产模式：`source-map`

##### 2、提升打包构建速度

| 方法                          | 效果                                                         |
| ----------------------------- | ------------------------------------------------------------ |
| `HotModuleReplacement`(`HMR`) | 在程序运行中，替换、添加或删除模块，而无需重新加载整个页面。 |
| `OneOf`                       | 打包时每个文件只会经过一个 `test` 正则处理，无需全部遍历     |
| `Include`/`Exclude`           | 指定/排除检查的文件                                          |
| `Cache`                       | 缓存之前 Eslint 检查 和 Babel 编译结果，提高重复打包效率     |
| `Thead`                       | 开启多进程同时处理 js 文件打包                               |

##### 3、减少代码体积

| 方法           | plugin                                                       | 效果                                             |
| -------------- | ------------------------------------------------------------ | ------------------------------------------------ |
| Tree Shaking   | 默认                                                         | 描述移除 JavaScript 中的没有使用上的代码（默认） |
| Babel          | `@babel/plugin-transform-runtime`                            | 将辅助代码作为一个独立模块，来避免重复引入       |
| Image Minimize | `image-minimizer-webpack-plugin`                             | 对本地项目静态图片进行压缩                       |
|                | `imagemin-gifsicle`、`imagemin-jpegtran`、`imagemin-optipng`、`imagemin-svgo` | 无损压缩                                         |
|                | `imagemin-gifsicle`、`imagemin-mozjpeg`、`imagemin-pngquant`、`imagemin-svgo` | 有损压缩                                         |

##### 4、优化代码运行性能

| 方法               | plugin                            | 效果                                                         |
| ------------------ | --------------------------------- | ------------------------------------------------------------ |
| Code Split         | 配置                              | 1、分割文件：将打包生成的文件进行分割，生成多个 js 文件。<br>2、按需加载：需要哪个文件就加载哪个文件。 |
| Preload / Prefetch | `@vue/preload-webpack-plugin`     | 在浏览器空闲时间，加载后续需要使用的资源<br>总结：当前页面优先级高的资源用 `Preload` 加载。 下一个页面需要使用的资源用 `Prefetch` 加载。 |
| Network Cache      | 配置                              | 对静态资源会使用缓存来优化，如果`contenthash`未发生变化，则浏览器会直接读取缓存。方式：文件命名 |
| Core-js            | `@babel/eslint-parser`、`core-js` | 解决 ES6 代码兼容性问题                                      |
| PWA                | `workbox-webpack-plugin`          | 在离线(offline)时应用程序能够继续运行功能                    |

---

#### webpack热更新

webpack 的热更新又称热替换（Hot Module Replacement），缩写为 **HMR**。 当你对代码进行修改并保存后，webpack 将对代码重新打包，并将新的模块发送到浏览器端，浏览器通过新的模块替换老的模块，这样在不刷新浏览器的前提下就能够对应用进行更新。

<img src="/Users/fjp_xiaoye999/Desktop/FJP/工作/知识图谱/webpack_热更新.jpg" style="zoom:80%;" />

HMR 进行模块热更新的过程（其中 webpack-dev-server 简称 WDS）：

1. webpack 对文件系统进行 watch 打包到内存中（1+2+3）
2. WDS 通知浏览器端文件发生改变，并带上新模块的 hash 值（4）
3. webpack-dev-server/client 接收到服务端消息并交由webpack进行比对处理（5+6）
4. webpack 资源比对出现差异后会向WDS发起 Ajax 请求来获取一个json文件，其中包括所有要更新的模块的 hash 值，这样，该模块就可以借助这些信息再次发起 jsonp 请求，获取到最新的模块代码（7+8+9）
5. HotModuleReplacement.runtime 对模块进行热更新（10+11）

---

#### Loader & Plugin

`Loader` 本质就是一个函数，在该函数中对接收到的内容进行转换，返回转换后的结果。 因为 Webpack 只认识 JavaScript，所以 Loader 就成了翻译官，对其他类型的资源进行转译的预处理工作。Loader 在 module.rules 中配置，作为模块的解析规则，类型为数组。每一项都是一个 Object，内部包含了 test(类型文件)、loader/use、options (参数include/exclude)等属性。

**编写规范**

- 链式调用 => Loader返回值必须是标准的 JS 代码字符串
- Loader 函数中的 this 上下文由 webpack 提供，包含当前loader需要的各种信息数据

`Plugin` 就是插件，基于事件流框架 ，插件可以扩展 Webpack 的功能，在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。Plugin 在 plugins 中单独配置，类型为数组，每一项是一个 Plugin 的实例，参数都通过构造函数传入。

**编写规范**

- Plugin 必须是一个函数或者是一个包含 `apply` 方法的对象，这样才能访问`compiler`实例
- 传给每个插件的对象都是同一个引用，若在一个插件中修改了它们身上的属性，会影响后面的插件
- 异步的事件需要在插件处理完任务时调用回调函数通知 `Webpack` 进入下一个流程，不然会卡住

---

