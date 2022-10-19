const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BeautifyHtmlWebpackPlugin = require( '@sumotto/beautify-html-webpack-plugin' );
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const ImageminWebpWebpackPlugin= require("imagemin-webp-webpack-plugin");
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';
const pagesPath = path.resolve(__dirname, 'src', 'pages');
const pages = fs.readdirSync(pagesPath).reduce((acc, child) => {
  const childPath = path.join(pagesPath, child);

  if (fs.lstatSync(childPath).isDirectory())
    acc.push({ name: child, path: childPath })

  return acc;
}, []);

const getBundleName = ext => `bundles/[name].${ext}`;

const getPagesPlugins = () => {
  return pages.reduce((acc, page) => {
    const pagePath = page.path;
    const pageName = page.name;
    const template = path.join(pagePath, `${pageName}.njk`);

    fs.existsSync(template) && acc.push(new HtmlWebpackPlugin({
      minify: false,
      hash: true,
      filename: `pages/${pageName}/${pageName}.html`,
      chunks: ['common', pageName],
      template
    }));

    return acc;
  }, []);
};

const getEntries = () => {
  return pages.reduce((acc, page) => {
    const name = page.name;
    const entry = path.join(page.path, `${name}.js`);

    fs.existsSync(entry) && (acc[name] = entry);

    return acc;
  }, {});
};

const getCSSLoaders = () => {
  return [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        publicPath: '/'
      }
    },
    'css-loader'
  ]
}

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: isProd ? 'production' : 'development',
  devtool: isProd ? false : 'inline-source-map',
  devServer: {
    open: ['/pages/index'],
    port: 'auto',
    hot: !isProd,
    static: {
      directory: path.join(__dirname, 'src')
    }
  },
  resolve: {
    extensions: ['.js', '.postcss'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  stats: {
    children: true
  },
  entry: getEntries(),
  module: {
    rules: [
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.(webm|mp4)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.svg$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name][ext]'
        }
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name][ext]'
        }
      },
      {
        test: /\.njk$/,
        use: [
          {
            loader: 'simple-nunjucks-loader',
            options: {
              searchPaths: [
                path.resolve(__dirname, 'src', 'components')
              ],
              assetsPaths: [
                path.resolve(__dirname, 'src', 'assets'),
                path.resolve(__dirname, 'src', 'components')
              ],
              filters: {
                svgContents: path.join(__dirname, 'bundler/nunjucks/filters/svg-contents.js'),
                svgo: path.join(__dirname, 'bundler/nunjucks/filters/svgo.js'),
                bemClassname: path.join(__dirname, 'bundler/nunjucks/filters/bem-classname.js'),
                attrs: path.join(__dirname, 'bundler/nunjucks/filters/attrs.js'),
                merge: path.join(__dirname, 'bundler/nunjucks/filters/merge.js'),
                indexOf: path.join(__dirname, 'bundler/nunjucks/filters/index-of.js'),
                stringify: path.join(__dirname, 'bundler/nunjucks/filters/stringify.js'),
                concat: path.join(__dirname, 'bundler/nunjucks/filters/concat.js'),
                split: path.join(__dirname, 'bundler/nunjucks/filters/split.js')
              },
              trimBlocks: true,
              lstripBlocks: true,
              dev: true
            }
          }
        ]
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(post|p)?css$/,
        use: getCSSLoaders().concat([
          'postcss-loader'
        ])
      },
      {
        test: /\.s[ac]ss$/i,
        use: getCSSLoaders().concat([
          'sass-loader',
          'postcss-loader'
        ])
      }
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: 'common'
    },
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          }
        },
        extractComments: false
      }),
      new CssMinimizerPlugin(),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              ['gifsicle', { interlaced: true }],
              ['mozjpeg', { quality: 80 }],
              ['pngquant'],
              ['svgo', require('./svgo.config.js')]
            ]
          }
        }
      })
    ]
  },
  plugins: [].concat(getPagesPlugins(), [
    new SVGSpritemapPlugin([
      'src/assets/**/*.svg',
      'src/components/**/*.svg'
    ], {
      sprite: {
        generate: {
          use: true,
          view: '-view',
          title: false
        }
      },
      styles: {
        filename: path.join(__dirname, 'src/components/sprites/_sprites.scss'),
        callback: content => `/* Do not edit directly. This file generated by SVGSpritemapPlugin */\n ${content}`
      }
    }),
    new BeautifyHtmlWebpackPlugin({
      indent_size: 2,
      preserve_newlines: false,
      indent_inner_html: true,
      extra_liners: ""
    }),
    new MiniCssExtractPlugin({
      ignoreOrder: true,
      filename: getBundleName('css'),
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/assets'),
          to: 'assets'
        }
      ]
    }),
    new ImageminWebpWebpackPlugin()
  ]),
  output: {
    filename: getBundleName('js'),
    assetModuleFilename: 'assets/[hash][ext][query]',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
};
