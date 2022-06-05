// "off" 或 0 - 关闭规则
// "warn" 或 1 - 开启规则，使用警告级别的错误：warn (不会导致程序退出)
// "error" 或 2 - 开启规则，使用错误级别的错误：error (当被触发的时候，程序会退出)
module.exports = {
  // 支持最新的最终 ECMAScript 标准
  parser: "@babel/eslint-parser",
  // 解析选项
  parserOptions: {
    ecmaVersion: 6, // ES 语法版本
    sourceType: "module", // ES 模块化
    allowImportExportEverywhere: true, // 不限制eslint对import使用位置
    ecmaFeatures: { // ES 其他特性
      jsx: true // 如果是 React 项目，就需要开启 jsx 语法
    }
  },
  // 继承其他规则
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended"
  ],
  // 具体检查规则
  rules: {
    "eqeqeq": ["warn", "smart"], // 全等
    "no-var": 2, // 不能使用 var 定义变量
    "global-require": 0,
  },
  // 预定义的全局变量
  env: {
    node: true, // 启用node中全局变量
    browser: true, // 启用浏览器中全局变量
  },
  plugins: ["import"], // 允许全局位置使用import
  // 其他规则详见：https://eslint.bootcss.com/docs/user-guide/configuring
};