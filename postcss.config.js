module.exports = {
  syntax: 'postcss-scss',
  plugins: [
    ['postcss-custom-media', {
      importFrom: [
        require('./src/components/custom-media/custom-media')
      ]
    }],
    'autoprefixer',
    'postcss-em',
    ['postcss-pxtorem', {
      rootValue: 16,
      propList: [
        '--*',
        'font',
        'font-size',
        'line-height',
        'letter-spacing',
        'margin',
        'margin-top',
        'margin-left',
        'margin-right',
        'margin-bottom',
        'padding',
        'padding-top',
        'padding-left',
        'padding-right',
        'padding-bottom'
      ]
    }]
  ]
};
