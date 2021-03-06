const reservedLoopbackNames = [
  'Any',
  'Array',
  'Boolean',
  'Date',
  'File',
  'Integer',
  'Model',
  'Number',
  'Object',
  'String',
];

const reservedJavascriptWords = [
  'do',
  'if',
  'in',
  'for',
  'let',
  'new',
  'try',
  'var',
  'case',
  'else',
  'enum',
  'eval',
  'null',
  'this',
  'true',
  'void',
  'with',
  'await',
  'break',
  'catch',
  'class',
  'const',
  'false',
  'super',
  'throw',
  'while',
  'yield',
  'delete',
  'export',
  'import',
  'public',
  'return',
  'static',
  'switch',
  'typeof',
  'default',
  'extends',
  'valueOf',
  'finally',
  'package',
  'private',
  'continue',
  'debugger',
  'toString',
  'function',
  'arguments',
  'interface',
  'protected',
  '__proto__',
  'implements',
  'instanceof',
  'constructor',
  'isPrototypeOf',
  'hasOwnProperty',
  'toLocaleString',
  '__defineGetter__',
  '__defineSetter__',
  '__lookupGetter__',
  '__lookupSetter__',
  'propertyIsEnumerable',
];

const reservedWords = [
  ...reservedLoopbackNames,
  ...reservedJavascriptWords,
].map(item => item.toLowerCase());

const INVALID_MODEL_NAME = 'Model name is invalid';

export default (name) => {
  if (reservedWords.includes(name.toLowerCase())) return 'Model name cannot be reserved word';
  if (!(/^[\-_a-zA-Z0-9]+$/).test(name)) return INVALID_MODEL_NAME;
  if (/[\-0-9]/.test(name[0])) return INVALID_MODEL_NAME;
  return '';
}
