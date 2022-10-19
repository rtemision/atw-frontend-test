const EOL = require('os').EOL;

function toCamelCase(str) {
  return str.replace(str[0], str[0].toUpperCase());
}

function normalize(str, naming) {
  return str
  .replace(naming.elemDelim, ' ')
  .replace(naming.modDelim, ' ')
  .replace(/-+/g, ' ') // word delimiter
  .split(' ')
  .map(toCamelCase).join('');
}

module.exports = function(entity, naming) {
  const name = naming.stringify({
    block: entity.block,
    elem: entity.elem
  });

  const capitalName = normalize(name, naming);

  let first, second;

  if (entity.modName)  {
    first = [
      `import { ${capitalName} } from '../${capitalName.toLowerCase()}';`,
      "",
      `export class ${normalize(naming.stringify(entity), naming)} extends ${capitalName} {`
    ]
  } else {
    first = [
      `import { DomElement } from '@/components/dom-element';`,
      `import { BemEntityMixin } from '@/components/bem-entity';`,
      "",
      `export class ${normalize(naming.stringify(entity), naming)} extends BemEntityMixin(DomElement) {`,
      "  static instances = {};",
      "",
      `  static bemEntityName = '${name}';`,
      ""
    ];
  }

  second = [
    "  constructor(domElem) {",
    "    super(domElem);",
    "    ",
    "  }",
    "}",
    ""
  ];

  return first.concat(second).join(EOL);
};
