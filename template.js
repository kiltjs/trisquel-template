
var conText = require('@trisquel/con-text'),
    parseTemplate = require('./parser'),
    renderTokens = require('./render'),
    preset_statements = require('./preset-statements');

function _compileTemplate(con_Text, statements, self_closed_statements, template_src) {
  var tokens = parseTemplate(template_src);

  return function (data) {
    return renderTokens(con_Text, tokens, data, statements);
  };
}

function createTemplateContext () {

  var con_Text = conText();
  var templates_cache = {};

  var statements = Object.create(preset_statements);
  var self_closed_statements = {};

  function template (template_src, data) {
    if( typeof template_src !== 'string' ) throw new TypeError('template source should be a String');

    return data === undefined ?
      _compileTemplate(con_Text, statements, self_closed_statements, template_src) :
      renderTokens(con_Text, parseTemplate(template_src, self_closed_statements), data, statements);
  }

  function _throwType (text, received) {
    throw new TypeError(text + ', received: ' + (typeof received) );
  }

  template.statement = function (statement_name, statementFn, self_closed) {
    if( typeof statement_name !== 'string' ) _throwType('statement (cmd) name should be a String', statement_name );
    if( typeof statementFn !== 'function' ) _throwType('statement function should be a Function', statementFn );
    if( self_closed ) self_closed_statements[self_closed] = true;

    return template;
  };
  template.cmd = template.statement;

  template.filter = function (filter_name, filterFn) {
    if( typeof filter_name !== 'string' ) _throwType('filter name should be a String', filter_name );
    if( typeof filterFn !== 'function' ) _throwType('filter function should be a Function', filterFn );

    con_Text.defineFilter(filter_name, filterFn);
    return template;
  };

  template.compile = function (template_src) {
    return _compileTemplate(con_Text, statements, self_closed_statements, template_src);
  };

  template.render = function (template_src, data) {
    return renderTokens(con_Text, parseTemplate(template_src, self_closed_statements), data, statements);
  };

  template.put = function (template_name, template_src) {
    templates_cache[template_name] = _compileTemplate(con_Text, statements, self_closed_statements, template_src);
    return template;
  };

  template.get = function (template_name) {
    return templates_cache[template_name];
  };

  return template;

}

module.exports = createTemplateContext();
