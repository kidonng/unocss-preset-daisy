(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('postcss'), require('autoprefixer'), require('postcss-js'), require('parsel-js'), require('lodash'), require('daisyui/src/theming/index.js'), require('daisyui/dist/utilities.js'), require('daisyui/dist/base.js'), require('daisyui/dist/unstyled.js'), require('daisyui/dist/styled.js'), require('daisyui/dist/utilities-unstyled.js'), require('daisyui/dist/utilities-styled.js'), require('daisyui/src/theming/themes.js'), require('daisyui/src/theming/functions.js'), require('daisyui/src/lib/utility-classes.js')) :
    typeof define === 'function' && define.amd ? define(['exports', 'postcss', 'autoprefixer', 'postcss-js', 'parsel-js', 'lodash', 'daisyui/src/theming/index.js', 'daisyui/dist/utilities.js', 'daisyui/dist/base.js', 'daisyui/dist/unstyled.js', 'daisyui/dist/styled.js', 'daisyui/dist/utilities-unstyled.js', 'daisyui/dist/utilities-styled.js', 'daisyui/src/theming/themes.js', 'daisyui/src/theming/functions.js', 'daisyui/src/lib/utility-classes.js'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.uodule = {}, global.postcss, global.autoprefixer, global.postcssJs, global.parselJs, global._, global.colors, global.utilities, global.base, global.unstyled, global.styled, global.utilitiesUnstyled, global.utilitiesStyled, global.themes, global.colorFunctions, global.utilityClasses));
})(this, (function (exports, postcss, autoprefixer, postcssJs, parselJs, _, colors, utilities, base, unstyled, styled, utilitiesUnstyled, utilitiesStyled, themes, colorFunctions, utilityClasses) { 'use strict';

    const processor = postcss(autoprefixer);
    const process = (object) => processor.process(object, { parser: postcssJs.parse });
    const replacePrefix = (css) => css.replaceAll('--tw-', '--un-');
    const defaultOptions = {
        styled: true,
        themes: false,
        base: true,
        utils: true,
        rtl: false,
        darkTheme: 'dark'
    };
    /**
     * Retrieves all non-atrule nodes from the provided node and its children.
     * @param {ChildNode} node - The node to traverse.
     * @returns {Rule[]} - An array containing non-atrule nodes.
     */
    const notAtruleNode = (node) => {
        const collectedRules = [];
        /**
         * Recursively collects non-atrule nodes.
         * @param {ChildNode} currentNode - The current node to examine.
         */
        const collectNonAtrules = (currentNode) => {
            if (currentNode.type === 'atrule') {
                for (const child of currentNode.nodes) {
                    collectNonAtrules(child);
                }
            }
            else {
                collectedRules.push(currentNode);
            }
        };
        collectNonAtrules(node);
        return collectedRules;
    };
    const presetDaisy = (options = {}) => {
        var _a;
        options = Object.assign(Object.assign({}, defaultOptions), options);
        const rules = new Map();
        const keyframes = [];
        const supports = [];
        const styles = [options.styled ? styled : unstyled];
        if (options.utils) {
            styles.push(utilities, utilitiesUnstyled, utilitiesStyled);
        }
        for (const node of styles.flatMap(style => process(style).root.nodes)) {
            const isAtRule = node.type === 'atrule';
            // @keyframes
            if (isAtRule && node.name === 'keyframes') {
                keyframes.push(String(node));
                continue;
            }
            if (isAtRule && node.name === 'supports') {
                supports.push(String(node));
                continue;
            }
            if (isAtRule && node.name !== 'supports' && node.name === 'keyframes') {
                console.log(node);
                continue;
            }
            // Unwrap @media if necessary
            const rule = notAtruleNode(node)[0];
            const selector = rule.selectors[0];
            const tokens = parselJs.tokenize(selector);
            const token = tokens[0];
            let base = '';
            if (token.type === 'class') {
                // Resolve conflicts with @unocss/preset-wind link variant
                // .link-* -> .link
                if (selector.startsWith('.link-')) {
                    base = 'link';
                }
                else if (selector.startsWith('.modal-open')) {
                    base = 'modal';
                }
                else {
                    base = token.name;
                }
            }
            else if (token.type === 'pseudo-class' && token.name === 'where') {
                // :where(.foo) -> .foo
                base = parselJs.tokenize(token.argument)[0].name;
            }
            else if (['[dir="rtl"]', ':root'].includes(token.content)) {
                // Special case for https://github.com/saadeghi/daisyui/blob/6db14181733915278621d9b2d128b0af43c52323/src/components/unstyled/modal.css#LL28C1-L28C89
                base = tokens[1].content.includes('.modal-open')
                    ? 'modal'
                    : // Skip prefixes
                        tokens[2].name;
            }
            rules.set(base, ((_a = rules.get(base)) !== null && _a !== void 0 ? _a : '') + String(rule) + '\n');
        }
        const preflights = [
            {
                getCSS: () => keyframes.join('\n'),
                layer: 'daisy-keyframes'
            },
            {
                getCSS: () => supports.join('\n'),
                layer: 'daisy-supports'
            }
        ];
        if (options.base) {
            preflights.unshift({
                // eslint-disable-next-line @typescript-eslint/naming-convention
                getCSS: () => replacePrefix(process(base).css),
                layer: 'daisy-base'
            });
        }
        colorFunctions.injectThemes(theme => {
            preflights.push({
                // eslint-disable-next-line @typescript-eslint/naming-convention
                getCSS: () => process(theme).css,
                layer: 'daisy-themes'
            });
        }, 
        // @ts-expect-error Return never
        key => {
            if (key === 'daisyui.themes') {
                return options.themes;
            }
            if (key === 'daisyui.darkTheme') {
                return options.darkTheme;
            }
        }, themes);
        return {
            name: 'unocss-preset-daisy',
            preflights,
            theme: Object.assign({ colors: Object.assign(Object.assign({}, Object.fromEntries(Object.entries(colors)
                    .filter(([color]) => 
                // Already in @unocss/preset-mini
                // https://github.com/unocss/unocss/blob/0f7efcba592e71d81fbb295332b27e6894a0b4fa/packages/preset-mini/src/_theme/colors.ts#L11-L12
                !['transparent', 'current'].includes(color) &&
                    // Added below
                    !color.startsWith('base'))
                    .map(([color, value]) => [_.camelCase(color), value]))), { base: Object.fromEntries(Object.entries(colors)
                        .filter(([color]) => color.startsWith('base'))
                        .map(([color, value]) => [color.replace('base-', ''), value])) }) }, utilityClasses),
            rules: [...rules].map(([base, rule]) => [
                new RegExp(`^${base}$`),
                () => replacePrefix(rule),
                {
                    layer: base.startsWith('checkbox-')
                        ? 'daisy-components-post'
                        : 'daisy-components'
                }
            ])
        };
    };

    exports.presetDaisy = presetDaisy;

}));
