const EOL = require('os').EOL;

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = ({ block, elem, modName, modVal }) => {
  const elemPart = elem ? `__${elem}` : '';
  const modValIsBoolean = typeof modVal === 'boolean';
  const modValStr = modVal && (modValIsBoolean ? '' : '_' + modVal) || '';
  const modPart = modName ? '_' + modName + modValStr : '';

  const macroName = [
    block,
    modName && !elem ? modPart : '',
    elem ? elemPart : '',
    elem && modName ? modPart : ''
  ].join('')
    .split('-')
    .map((el, i) => i === 0 ? el : capitalizeFirstLetter(el))
    .join('');

  let result = [
    `{% from 'dom-element/dom-element.njk' import domElement %}`,
    `{#`,
    `  @param {Object} data`,
    `#}`,
    `{% macro ${macroName}(data) %}`,
    `  {% set content %}`,
    `    `,
    `  {% endset %}`,
    ``,
    '  {{ domElement({',
    `    tag: '',`,
    `    bemEntity: {`,
    `      block: '${block}',`
  ];

  elem && result.push(
    `      elem: '${elem || ''}',`
  );

  result.push(modValIsBoolean ?
    `      mods: data.mods${modVal ? ` | merge({ ${modName}: ${modVal} })` : ''},` :
    `      mods: data.mods${modVal ? ` | merge({ ${modName}: '${modVal}' })` : ''},`
  );

  result = result.concat([
    `      mix: data.mix,`,
    `      classname: data.classname`,
    `    },`,
    `    attrs: {`,
    `      `,
    `    },`,
    `    content: content`,
    `  }) }}`,
    '{% endmacro %}',
    ''
  ]);

  return result.join(EOL);
};
