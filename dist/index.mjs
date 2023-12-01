import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import { parse } from 'postcss-js';
import { tokenize } from 'parsel-js';
import _ from 'lodash';
import colors from 'daisyui/src/theming/index.js';
import utilities from 'daisyui/dist/utilities.js';
import base from 'daisyui/dist/base.js';
import unstyled from 'daisyui/dist/unstyled.js';
import styled from 'daisyui/dist/styled.js';
import utilitiesUnstyled from 'daisyui/dist/utilities-unstyled.js';
import utilitiesStyled from 'daisyui/dist/utilities-styled.js';
import themes from 'daisyui/src/theming/themes.js';
import colorFunctions from 'daisyui/src/theming/functions.js';
import utilityClasses from 'daisyui/src/lib/utility-classes.js';

const processor = postcss(autoprefixer);
const process = (object) => processor.process(object, { parser: parse });
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
        const tokens = tokenize(selector);
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
            base = tokenize(token.argument)[0].name;
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

export { presetDaisy };
