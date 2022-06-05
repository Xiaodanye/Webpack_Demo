module.exports = {
  // 智能预设：能够编译ES6语法
  presets: [
    [
      "@vue/cli-plugin-babel/preset",
      // 按需加载core-js的polyfill
      {
        useBuiltIns: "usage",
        corejs: { version: "3", proposals: true }
      },
    ],
  ],
};