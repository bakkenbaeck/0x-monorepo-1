const { toJSX } = require('@mdx-js/mdx/mdx-hast-to-jsx');

function mdxTableOfContents(options = {}) {
    let OldCompiler = this.Compiler;
    let info;

    this.Compiler = tree => {
        let code = OldCompiler(tree, {}, options);

        if (!info.hasTableOfContentsExport) {
            code += `\nexport const tableOfContents = (components={}) => ${tableOfContentsListSerializer(
                info.tableOfContents,
            )}\n`;
        }

        return code;
    };

    return function transformer(node) {
        info = getInfo(node, options);
    };
}

function getInfo(root, { minLevel = 1, maxLevel = 3 } = {}) {
    let info = {
        hasFrontMatterExport: false,
        hasTableOfContentsExport: false,
        tableOfContents: [],
    };

    addSections(info.tableOfContents, root.children, minLevel, maxLevel);

    return info;
}

function addSections(parent, children, minLevel, maxLevel) {
    for (let i = 0; i < children.length; i++) {
        let node = children[i];

        if (node.type === 'export' && node.value.indexOf('tableOfContents') !== -1) {
            info.hasTableOfContentsExport = true;
        }

        if (isSlugifiedSection(node)) {
            let level = node.properties.depth;

            if (level >= minLevel && level <= maxLevel) {
                let id = node.properties.id;

                let item = {
                    id,
                    level,
                    title: toFragment(node.children[0].children),
                    children: [],
                };

                if (parent.children) {
                    parent.children.push(item);
                } else {
                    parent.push(item);
                }

                addSections(item, node.children, minLevel, maxLevel);
            }
        }
    }
}

function isSlugifiedSection(node) {
    return node.tagName === 'section' && node.properties && node.properties.id && node.properties.depth;
}

function toFragment(nodes) {
    if (nodes.length === 1 && nodes[0].type === 'text') {
        return JSON.stringify(nodes[0].value);
    } else {
        return '<React.Fragment>' + nodes.map(toJSX).join('') + '</React.Fragment>';
    }
}

function tableOfContentsListSerializer(nodes, indent = 0) {
    return indentString(
        indent,
        `[
  ${nodes.map(node => tableOfContentsNodeSerializer(node, indent + 2)).join(',\n')}
]`,
    );
}

function tableOfContentsNodeSerializer(node, indent = 0) {
    return indentString(
        indent,
        `{
  id: ${JSON.stringify(node.id)},
  level: ${node.level},
  title: ${node.title},
  children: ${tableOfContentsListSerializer(node.children, indent + 2)}
}`,
    );
}

function indentString(size, string) {
    return string
        .split('\n')
        .map(x => ' '.repeat(size) + x)
        .join('\n')
        .trim();
}

module.exports = mdxTableOfContents;
