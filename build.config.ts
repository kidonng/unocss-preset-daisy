import {defineBuildConfig} from 'unbuild'

export default defineBuildConfig({
	entries: ['./index'],
	declaration: true,
	rollup: {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		emitCJS: true,
	},
})
