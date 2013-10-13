/**
 * SyntaxHighlighter
 * http://alexgorbatchev.com/SyntaxHighlighter
 *
 * SyntaxHighlighter is donationware. If you are using it, please donate.
 * http://alexgorbatchev.com/SyntaxHighlighter/donate.html
 *
 * @version
 * 3.0.83 (July 02 2010)
 * 
 * @copyright
 * Copyright (C) 2004-2010 Alex Gorbatchev.
 *
 * @license
 * Dual licensed under the MIT and GPL licenses.
 */
;
(function () {
    // CommonJS
    typeof (require) != 'undefined' ? SyntaxHighlighter = require('shCore').SyntaxHighlighter : null;

    function Brush() {
        
        //taken from the XML brush

        function process(match, regexInfo) {
            var constructor = SyntaxHighlighter.Match,
                code = match[0],
                tag = new XRegExp('(&lt;|<)[\\s\\/\\?]*(?<name>[:\\w-\\.]+)', 'xg').exec(code),
                result = [];

            if (match.attributes != null) {
                var attributes,
                    regex = new XRegExp('(?<name> [\\w:\\-\\.]+)' +
                        '\\s*=\\s*' +
                        '(?<value> ".*?"|\'.*?\'|\\w+)',
                        'xg');

                while ((attributes = regex.exec(code)) != null) {
                    result.push(new constructor(attributes.name, match.index + attributes.index, 'color1'));
                    result.push(new constructor(attributes.value, match.index + attributes.index + attributes[0].indexOf(attributes.value), 'string'));
                }
            }

            if (tag != null)
                result.push(
                    new constructor(tag.name, match.index + tag[0].indexOf(tag.name), 'keyword')
                );

            return result;
        }

        //taken from the CSharp brush
        var keywords = 'abstract as base bool break byte case catch char checked class const ' +
            'continue decimal default delegate do double else enum event explicit ' +
            'extern false finally fixed float for foreach get goto if implicit in int ' +
            'interface internal is lock long namespace new null object operator out ' +
            'override params private protected public readonly ref return sbyte sealed set ' +
            'short sizeof stackalloc static string struct switch this throw true try ' +
            'typeof uint ulong unchecked unsafe ushort using virtual void while';

        function fixComments(match, regexInfo) {
            var css = (match[0].indexOf("///") == 0)
                ? 'color1'
                : 'comments';

            return [new SyntaxHighlighter.Match(match[0], match.index, css)];
        }

        this.regexList = [
            //#region XmlMatching
            { regex: new XRegExp('(\\&lt;|<)\\!\\[[\\w\\s]*?\\[(.|\\s)*?\\]\\](\\&gt;|>)', 'gm'), css: 'color2' }, // <![ ... [ ... ]]>
            { regex: SyntaxHighlighter.regexLib.xmlComments, css: 'comments' }, // <!-- ... -->
            { regex: new XRegExp('(&lt;|<)[\\s\\/\\?]*(\\w+)(?<attributes>.*?)[\\s\\/\\?]*(&gt;|>)', 'sg'), func: process },
            //#endregion
            { regex: SyntaxHighlighter.regexLib.singleLineCComments, func: fixComments }, // one line comments
            { regex: SyntaxHighlighter.regexLib.multiLineCComments, css: 'comments' }, // multiline comments
            { regex: /@"(?:[^"]|"")*"/g, css: 'string' }, // @-quoted strings
            { regex: SyntaxHighlighter.regexLib.doubleQuotedString, css: 'string' }, // strings
            { regex: SyntaxHighlighter.regexLib.singleQuotedString, css: 'string' }, // strings
            { regex: /(\w+)\./gm, css: "classname" },
            { regex: /^(\s)*@/gm, css: 'razorAt' }, // preprocessor tags like @template      
            { regex: /^\s*#.*/gm, css: 'preprocessor' }, // preprocessor tags like #region and #endregion
            { regex: new RegExp(this.getKeywords(keywords), 'gm'), css: 'keyword' }, // c# keyword
            { regex: /\bpartial(?=\s+(?:class|interface|struct)\b)/g, css: 'keyword' }, // contextual keyword: 'partial'
            { regex: /\byield(?=\s+(?:return|break)\b)/g, css: 'keyword' }			// contextual keyword: 'yield'
        ];

        this.forHtmlScript(SyntaxHighlighter.regexLib.aspScriptTags);
    }

    ;

    Brush.prototype = new SyntaxHighlighter.Highlighter();
    Brush.aliases = ['razor'];

    SyntaxHighlighter.brushes.CSharp = Brush;

    // CommonJS
    typeof (exports) != 'undefined' ? exports.Brush = Brush : null;
})();