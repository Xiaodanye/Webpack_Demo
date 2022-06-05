// Webpack 是基于 Node.js 运行的，所以采用 Common.js 模块化规范
const os = require("os"); // nodejs核心模块，直接使用
const path = require("path"); // Node.js的核心模块，专门用来处理文件路径
const { DefinePlugin } = require("webpack");
const { VueLoaderPlugin } = require("vue-loader");
const CopyPlugin = require("copy-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const AutoImport = require("unplugin-auto-import/webpack");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const EslintWebpackPlugin = require("eslint-webpack-plugin");
const Components = require("unplugin-vue-components/webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PreloadWebpackPlugin = require("@vue/preload-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
const { ElementPlusResolver } = require("unplugin-vue-components/resolvers");

const threads = os.cpus().length; // cpu核数
const isProduction = process.env.NODE_ENV === "production";
// 返回处理样式loader函数
function getStyleLoaders(styleLoader) {
  return [
    isProduction ? MiniCssExtractPlugin.loader : "vue-style-loader",
    "css-loader",
    {
      // 处理css兼容性问题
      // 配合package.json中browserslist来指定兼容性
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: [
            "postcss-preset-env", // 能解决大多数样式兼容性问题
          ],
        },
      },
    },
    styleLoader && {
      loader: styleLoader,
      options: styleLoader === "sass-loader" ? {
          additionalData: `@use "@/styles/element/index.scss" as *;`,
        } : {},
    },
  ].filter(Boolean)
}

module.exports = {
  entry: './src/main.js',
  output: {
    path: isProduction ? path.resolve(__dirname, "../dist") : undefined,
    filename: isProduction ? "static/js/[name].[contenthash:10].js" : "static/js/[name].js",
    chunkFilename: isProduction ? "static/js/[name].[contenthash:10].chunk.js" : "static/js/[name].chunk.js",
    assetModuleFilename: "static/media/[hash:10][ext][query]",
    clean: true, // 打包自动清空dist目录
  },
  module: {
    rules: [
      // 处理Css
      {
        test: /\.css$/i,
        use: getStyleLoaders(),
      },
      {
        test: /\.less$/i,
        use: getStyleLoaders("less-loader"),
      },
      {
        test: /\.s[ac]ss$/i,
        use: getStyleLoaders("sass-loader"),
      },
      {
        test: /\.styl$/i,
        use: getStyleLoaders("stylus-loader"),
      },
      // 处理图片
      {
        test: /\.(jpe?g|png|gif|webp|svg)$/i,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
      },
      // 处理其他资源
      {
        test: /\.(woff2?|ttf|mp3|mp4|avi|rmvb)$/,
        type: "asset/resource",
      },
      // 处理js
      {
        test: /\.js$/,
        include: path.resolve(__dirname, "../src"),
        use: [
          // {
          //   loader: "thread-loader", // 开启多进程
          //   options: {
          //     workers: threads, // 数量
          //   },
          // },
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true, // 开启babel编译缓存
              cacheCompression: false, // 缓存文件不要压缩
              plugins: ["@babel/plugin-transform-runtime"], // 减少代码体积
            }
          },
        ],
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
        options: {
          // 开启缓存
          cacheDirectory: path.resolve(__dirname, "../node_modules/.cache/vue-loader"),
        },
      },
    ]
  },
  plugins: [
    new EslintWebpackPlugin({
      context: path.resolve(__dirname, "../src"), // 指定检查文件的根目录
      exclude: "node_modules", // 默认值
      cache: true, // 开启缓存
      cacheLocation: path.resolve(__dirname, "../node_modules/.cache/.eslintcache"), // 缓存目录
      // threads, // 开启多进程
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../public/index.html"),
    }),
    // 提取css成单独文件
    isProduction && new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css',
      chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
    }),
    isProduction && new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "../public"),
          to: path.resolve(__dirname, "../dist"),
          globOptions: {
            // 忽略index.html文件
            ignore: ["**/index.html"],
          },
        },
      ],
    }),
    // 开启浏览器空闲加载（兼容性问题）
    new PreloadWebpackPlugin({
      rel: "preload", // preload兼容性更好
      as: "script",
      // rel: 'prefetch' // prefetch兼容性更差
    }),
    // PWM：ServiceWorkers
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
    }),
    new VueLoaderPlugin(),
    // cross-env定义的环境变量给打包工具使用
    // DefinePlugin定义环境变量给源代码使用，从而解决vue3页面警告的问题
    new DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
    }),
    // 按需加载element-plus
    AutoImport({
      resolvers: [ ElementPlusResolver() ],
    }),
    Components({
      resolvers: [
        ElementPlusResolver({
          // 自定义主题，引入sass
          importStyle: "sass",
        }),
      ],
    }),
  ].filter(Boolean),
  optimization: {
    minimize: isProduction,
    minimizer: [
      new CssMinimizerWebpackPlugin(), // Css压缩
      // 当生产模式会默认开启TerserWebpackPlugin，但是我们需要进行其他配置，就要重新写了
      new TerserWebpackPlugin({
        parallel: threads // 开启多进程
      }),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminGenerate,
          options: {
            plugins: [
              ["gifsicle", { interlaced: true }],
              ["jpegtran", { progressive: true }],
              ["optipng", { optimizationLevel: 5 }],
              [
                "svgo",
                {
                  plugins: [
                    "preset-default",
                    "prefixIds",
                    {
                      name: "sortAttrs",
                      params: {
                        xmlnsOrder: "alphabetical",
                      },
                    },
                  ],
                },
              ],
            ],
          },
        },
      }),
    ],
    splitChunks: {
      chunks: "all", // 对所有模块都进行分割
      cacheGroups: {
        vue: {
          test: /[\\/]node_modules[\\/]vue(.*)?[\\/]/,
          name: "vue-chunk",
          priority: 40,
        },
        elementPlus: {
          test: /[\\/]node_modules[\\/]element-plus[\\/]/,
          name: "elementPlus-chunk",
          priority: 30,
        },
        libs: {
          test: /[\\/]node_modules[\\/]/,
          name: "libs-chunk",
          priority: 20,
        },
      },
    },
    // 提取runtime文件
    runtimeChunk: {
      name: (entrypoint) => `runtime~${entrypoint.name}.js`, // runtime文件命名规则
    },
  },
  // webpack解析模块加载选项
  resolve: {
    // 自动补全文件扩展名
    extensions: [".vue", ".js", ".json"],
    // 路径别名
    alias: {
      "@": path.resolve(__dirname, "../src"),
    },
  },
  devServer: {
    host: "localhost", // 启动服务器域名
    port: 3000, // 启动服务器端口号
    open: true, // 是否自动打开浏览器
    hot: true, // 开启HMR
    historyApiFallback: true, // 解决前端路由刷新404问题
  },
  performance: false, // 关闭性能检查
  mode: 'development',
  devtool: "cheap-module-source-map",
}