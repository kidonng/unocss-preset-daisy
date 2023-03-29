import postcss, {type Rule} from 'postcss'
import {parse, type CssInJs} from 'postcss-js'
import {tokenize, type ClassToken, type AttributeToken} from 'parsel-js'
import type {Preset, Preflight, DynamicRule} from 'unocss'
import camelCase from 'camelcase'

import colors from 'daisyui/src/colors/index.js'
import utilities from 'daisyui/dist/utilities.js'
import base from 'daisyui/dist/base.js'
import unstyled from 'daisyui/dist/unstyled.js'
import unstyledRtl from 'daisyui/dist/unstyled.rtl.js'
import styled from 'daisyui/dist/styled.js'
import styledRtl from 'daisyui/dist/styled.rtl.js'
import utilitiesUnstyled from 'daisyui/dist/utilities-unstyled.js'
import utilitiesStyled from 'daisyui/dist/utilities-styled.js'
import themes from 'daisyui/src/colors/themes.js'
import colorFunctions from 'daisyui/src/colors/functions.js'

const processor = postcss.default()
const toCss = (object: CssInJs) => processor.process(parse(object)).css

const replacePrefix = (css: string) => css.replace(/--tw-/g, '--un-')
// UnoCSS uses comma syntax
const replaceSlash = (css: string) => css.replace(/\) \/ /g, '), ')
const replaceSpace = (css: string) => css.replace(/ /g, ', ')

const defaultOptions = {
	styled: true,
	themes: true as boolean | string[],
	base: true,
	utils: true,
	rtl: false,
}

export const presetDaisy = (
	options: Partial<typeof defaultOptions> = {},
): Preset => {
	options = {...defaultOptions, ...options}

	const rules = new Map<string, string>()
	const keyframes: string[] = []

	const styles = [
		options.styled
			? options.rtl
				? styledRtl
				: styled
			: options.rtl
			? unstyledRtl
			: unstyled,
	]
	if (options.utils) styles.push(utilities, utilitiesUnstyled, utilitiesStyled)

	for (const node of styles.flatMap((style) => parse(style).nodes)) {
		const isAtRule = node.type === 'atrule'
		if (isAtRule && node.name === 'keyframes') {
			keyframes.push(String(node))
			continue
		}

		// Unwrap `@media` if necessary
		const rule = (isAtRule ? node.nodes[0]! : node) as Rule

		let selector = rule.selectors[0]!
		// Skip modifiers
		if (
			selector.startsWith('.collapse-open') ||
			selector.startsWith('.modal-open')
		)
			selector = rule.selectors[1]!

		const token = tokenize(selector)[0]!
		let base = ''

		// .foo
		if (token.type === 'class') {
			// Resolve conflicts with @unocss/preset-wind `link:` variant
			base = token.name.startsWith('link-') ? 'link' : token.name
		}
		// :where(.foo)
		else if (token.type === 'pseudo-class' && token.name === 'where')
			base = (tokenize(token.argument!)[0] as ClassToken).name
		// `[dir="rtl"] .foo` & `:root .foo`
		else base = (tokenize(selector)[2] as ClassToken).name

		rules.set(
			base,
			(rules.get(base) ?? '') +
				replaceSlash(replacePrefix(String(rule))) +
				'\n',
		)
	}

	// Move `.btn-outline` after `btn-*`
	const btnOutline = rules.get('btn-outline')!
	rules.delete('btn-outline')
	rules.set('btn-outline', btnOutline)

	const preflights: Preflight[] = [
		{
			// eslint-disable-next-line @typescript-eslint/naming-convention
			getCSS: () =>
				toCss(
					Object.fromEntries(
						Object.entries(themes)
							.filter(([selector]) => {
								const theme = (tokenize(selector)[0] as AttributeToken).value!

								if (options.themes === false) return theme === 'light'
								if (Array.isArray(options.themes))
									return options.themes.includes(theme)

								return true
							})
							.map(([selector, colors], index) => {
								const theme = (tokenize(selector)[0] as AttributeToken).value!
								const isDefault = Array.isArray(options.themes)
									? index === 0
									: theme === 'light'

								return [
									isDefault ? `:root, ${selector}` : selector,
									Object.fromEntries(
										Object.entries(colorFunctions.convertToHsl(colors)).map(
											([prop, value]) => [prop, replaceSpace(value)],
										),
									),
								]
							}),
					),
				),
		},
		{
			// eslint-disable-next-line @typescript-eslint/naming-convention
			getCSS: () => keyframes.join('\n'),
		},
	]

	if (options.base)
		preflights.push({
			// eslint-disable-next-line @typescript-eslint/naming-convention
			getCSS: () => replaceSlash(replacePrefix(toCss(base))),
		})

	return {
		name: 'unocss-preset-daisy',
		preflights,
		theme: {
			colors: {
				...Object.fromEntries(
					Object.entries(colors)
						.filter(
							([color]) =>
								// Already in preset-mini
								// https://github.com/unocss/unocss/blob/0f7efcba592e71d81fbb295332b27e6894a0b4fa/packages/preset-mini/src/_theme/colors.ts#L11-L12
								!['transparent', 'current'].includes(color) &&
								// Added below
								!color.startsWith('base'),
						)
						.map(([color, value]) => [camelCase(color), value({})]),
				),
				base: Object.fromEntries(
					Object.entries(colors)
						.filter(([color]) => color.startsWith('base'))
						.map(([color, value]) => [color.replace('base-', ''), value({})]),
				),
			},
		},
		rules: [...rules].map(
			(rule) =>
				[
					new RegExp(`^${rule[0]}$`),
					() => rule[1],
					{layer: 'components'},
				] as DynamicRule,
		),
	}
}
