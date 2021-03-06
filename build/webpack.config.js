'use strict'
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const project = require('../project.config')
const HappyPack = require('happypack')
// const happyThreadPool = HappyPack.ThreadPool({ size: 5 })

const inProject = path.resolve.bind(path, project.basePath)
const inProjectSrc = (file) => inProject(project.srcDir, file)

const __DEV__ = project.env === 'development' || project.env === 'predev'
const __TEST__ = project.env === 'test'
const __PROD__ = project.env === 'production' || project.env === 'pretest'

const pkg = require('../package.json')

let theme = {}

if (pkg.theme && typeof (pkg.theme) === 'string') {
  let cfgPath = pkg.theme
  // relative path
  if (cfgPath.charAt(0) === '.') {
    cfgPath = path.resolve(__dirname, '../', cfgPath)
  }
  const getThemeConfig = require(cfgPath)
  theme = getThemeConfig()
} else if (pkg.theme && typeof (pkg.theme) === 'object') {
  theme = pkg.theme
}

const config = {
  entry: {
    normalize: [
      inProjectSrc('normalize'),
    ],
    main: [
      inProjectSrc(project.main),
    ],
  },
  devtool: project.sourcemaps ? 'source-map' : false,
  output: {
    path: inProject(project.outDir),
    filename: __DEV__ ? '[name].js' : '[name].[chunkhash].js',
    publicPath: project.publicPath,
  },
  resolve: {
    modules: [
      inProject(project.srcDir),
      'node_modules',
    ],
    alias: {
      vcms: path.resolve(__dirname, '../src/components/'),
      vctns: path.resolve(__dirname, '../src/containers/'),
      vassets: path.resolve(__dirname, '../src/assets/'),
      vstore: path.resolve(__dirname, '../src/store/'),
      vi18n: path.resolve(__dirname, '../src/i18n/'),
      vbuild: path.resolve(__dirname, '../build/'),
      vcfg: path.resolve(__dirname, '../config/'),
      vutils: path.resolve(__dirname, '../src/utils/'),
    },
    extensions: ['*', '.web.jsx', '.web.js', '.js', '.jsx', '.json'],
  },
  externals: project.externals,
  module: {
    rules: [],
  },
  plugins: [
    new webpack.DefinePlugin(Object.assign({
      'process.env': { NODE_ENV: JSON.stringify(project.env) },
      __DEV__,
      __TEST__,
      __PROD__,
    }, project.globals))
  ],
}

// JavaScript
// ------------------------------------
config.module.rules.push({
  test: /\.(js|jsx)$/,
  exclude: /node_modules/,
  use: [
    'happypack/loader?id=babel'
  ]
  // use: [{
  //   loader: 'babel-loader',
  //   query: {
  //     cacheDirectory: true,
  //     plugins: [
  //       'babel-plugin-transform-class-properties',
  //       'babel-plugin-syntax-dynamic-import',
  //       [
  //         'babel-plugin-transform-runtime',
  //         {
  //           helpers: true,
  //           polyfill: false, // we polyfill needed features in src/normalize.js
  //           regenerator: true,
  //         },
  //       ],
  //       [
  //         'babel-plugin-transform-object-rest-spread',
  //         {
  //           useBuiltIns: true // we polyfill Object.assign in src/normalize.js
  //         },
  //       ],
  //       [
  //         'import', [
  //           {
  //             'libraryName': 'antd',
  //             'style': true
  //           },
  //           {
  //             'libraryName': 'antd-mobile',
  //             'libraryDirectory': 'lib',
  //             'style': true
  //           }
  //         ]
  //       ]
  //     ],
  //     presets: [
  //       'babel-preset-react',
  //       ['babel-preset-env', {
  //         modules: false,
  //         targets: {
  //           ie9: true,
  //         },
  //         uglify: true,
  //       }],
  //     ]
  //   },
  // }],
})

// Styles
// ------------------------------------
const extractStyles = new ExtractTextPlugin({
  filename: 'styles/[name].[contenthash].css',
  allChunks: true,
  disable: __DEV__,
})

config.module.rules.push({
  test: /\.(sass|scss)$/,
  loader: extractStyles.extract({
    fallback: 'style-loader',
    use: [
      {
        loader: 'css-loader',
        options: {
          sourceMap: project.sourcemaps,
          minimize: {
            autoprefixer: {
              add: true,
              remove: true,
              browsers: ['last 2 versions'],
            },
            discardComments: {
              removeAll : true,
            },
            discardUnused: false,
            mergeIdents: false,
            reduceIdents: false,
            safe: true,
            sourcemap: project.sourcemaps,
          },
        },
      },
      {
        loader: 'sass-loader',
        options: {
          sourceMap: project.sourcemaps,
          includePaths: [
            inProjectSrc('styles'),
          ],
        },
      }
    ],
  })
})
config.module.rules.push({
  test: /\.less$/,
  loader: extractStyles.extract({
    fallback: 'style-loader',
    use: [
      {
        loader: 'css-loader',
        options: {
          sourceMap: project.sourcemaps,
          minimize: {
            autoprefixer: {
              add: true,
              remove: true,
              browsers: ['last 2 versions'],
            },
            discardComments: {
              removeAll : true,
            },
            discardUnused: false,
            mergeIdents: false,
            reduceIdents: false,
            safe: true,
            sourcemap: project.sourcemaps,
          },
        },
      },
      // {
      //   loader: 'postcss-loader',
      //   options: {
      //     sourceMap: project.sourcemaps,
      //     includePaths: [
      //       inProjectSrc('styles'),
      //     ],
      //     plugins: (loader) => [
      //       require('postcss-pxtorem')({ rootValue: PX2REM_ROOT, propWhiteList: [] }),
      //     ]
      //   },
      // },
      {
        loader: 'less-loader',
        options: {
          sourceMap: project.sourcemaps,
          includePaths: [
            inProjectSrc('styles'),
          ],
          modifyVars: theme
        },
      }
    ],
  })
})
config.module.rules.push({
  test    : /\.css$/,
  use: ExtractTextPlugin.extract({
    use: ['happypack/loader?id=css'],
  }),
  // use: ExtractTextPlugin.extract({
  //   fallback: 'style-loader',
  //   use: [
  //     {
  //       loader: 'css-loader',
  //       options: {
  //         sourceMap: true,
  //         minimize: true
  //       }
  //     },
  //   ]
  // })
})
config.plugins.push(extractStyles)

// Images
// ------------------------------------
config.module.rules.push({
  test    : /\.(png|jpg|gif)$/,
  exclude: /node_modules/,
  use: [
    {
      loader  : 'url-loader',
      options : {
        limit : 8192,
      },
    },
    {
      loader: 'image-webpack-loader',
      query: {
        mozjpeg: {
          progressive: true,
        },
        gifsicle: {
          interlaced: false,
        },
        optipng: {
          optimizationLevel: 7,
        },
        pngquant: {
          quality: '65-90',
          speed: 4
        }
      }
    }
  ]
})

// Fonts
// ------------------------------------
;[
  ['woff', 'application/font-woff'],
  ['woff2', 'application/font-woff2'],
  ['otf', 'font/opentype'],
  ['ttf', 'application/octet-stream'],
  ['eot', 'application/vnd.ms-fontobject'],
  ['svg', 'image/svg+xml'],
].forEach((font) => {
  const extension = font[0]
  const mimetype = font[1]

  config.module.rules.push({
    test    : new RegExp(`\\.${extension}$`),
    loader  : 'url-loader',
    options : {
      name  : 'fonts/[name].[ext]',
      limit : 10000,
      mimetype,
    },
  })
})

// Markdown
config.module.rules.push({
  test: /\.md$/,
  exclude: /node_modules/,
  use: 'raw-loader',
})

// Happypack
config.plugins.push(
  new HappyPack(
    {
      // 用唯一的标识符 id 来代表当前的HappyPack 是用来处理一类特定的文件
      id: 'babel',
      threads: 4,
      // threadPool: happyThreadPool,
      // 如何处理 .js 文件，用法和 Loader配置中一样
      loaders: [
        {
          loader: 'babel-loader',
          query: {
            cacheDirectory: true,
            plugins: [
              'babel-plugin-transform-class-properties',
              'babel-plugin-syntax-dynamic-import',
              [
                'babel-plugin-transform-runtime',
                {
                  helpers: true,
                  polyfill: false, // we polyfill needed features in src/normalize.js
                  regenerator: true,
                },
              ],
              [
                'babel-plugin-transform-object-rest-spread',
                {
                  useBuiltIns: true // we polyfill Object.assign in src/normalize.js
                },
              ],
              [
                'import', [
                  {
                    'libraryName': 'antd',
                    'style': true
                  },
                ]
              ]
            ],
            presets: [
              'babel-preset-react',
              ['babel-preset-env', {
                modules: false,
                targets: {
                  ie9: true,
                },
                uglify: true,
              }],
            ]
          },
        }
      ]
    }
  )
)

config.plugins.push(
  new HappyPack(
    {
      id: 'css',
      threads: 4,
      // threadPool: happyThreadPool,
      loaders: [
        {
          loader: 'style-loader'
        },
        {
          loader: 'css-loader',
          options: {
            sourceMap: true,
            minimize: true
          }
        },
      ]
    }
  )
)

// HTML Template
// ------------------------------------
config.plugins.push(new HtmlWebpackPlugin({
  template: inProjectSrc('index.html'),
  inject: true,
  minify: {
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: true
  },
}))

// Development Tools
// ------------------------------------
if (__DEV__) {
  config.entry.main.push(
    `webpack-hot-middleware/client.js?path=${config.output.publicPath}__webpack_hmr`
  )
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  )
}

// Bundle Splitting
// ------------------------------------
if (!__TEST__) {
  const bundles = ['normalize', 'manifest']

  if (project.vendors && project.vendors.length) {
    bundles.unshift('vendor')
    config.entry.vendor = project.vendors
  }
  config.plugins.push(new webpack.optimize.CommonsChunkPlugin({ names: bundles }))
}

// Production Optimizations
// ------------------------------------
if (__PROD__) {
  config.plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: !!config.devtool,
      cache: true,
      comments: false,
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
      },
    })
  )
}

module.exports = config
