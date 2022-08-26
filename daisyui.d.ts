declare module 'daisyui/src/colors/index.js' {
	// The value can also be a string, ignore them as they are filtered
	const colors: Record<string, (options: {opacityValue?: string}) => string>
	export default colors
}
