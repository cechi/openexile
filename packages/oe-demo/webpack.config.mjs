import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default (env) => {
	const mode = env.prod ? 'production' : 'development';
	const config = {
		entry: {
			'app': {import: './src/index.ts', filename: 'bundle.js'},
			'icons': {import: './src/icons.ts', filename: 'icons.js'},
		},
		mode: mode,
		externals: {
			'monaco-editor': 'monaco-editor',
		},
		output: {
			globalObject: 'self',
			path: path.resolve(__dirname, 'dist'),
			//chunkFilename: (pathData) =>  `chunks/${pathData.chunk.hash}.js`,
		},
		module: {
			rules: [{
				test: /\.tsx?$/,
				use: {
					loader: 'ts-loader',
					options: {
						transpileOnly: false, // Set to true if you are using fork-ts-checker-webpack-plugin
						projectReferences: true
					}
				}
			}, {
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			}, {
				test: /\.ttf$/,
				type: 'asset/resource'
			}],
		},
		resolve: {
			extensions: ['.tsx', '.ts', '.js'],
		},
		devServer: {
			static: [
				{directory: './public'}, 
				{directory: './dist'},
				{directory: '../oe-assets', publicPath: '/assets'},
			],
			hot: true,
			compress: true,
			port: 3000,
			client: {
				overlay: true
			},
			proxy: {
				'/server': {
					target: 'http://localhost:3000',
					router: () => 'http://localhost:3001',
					pathRewrite: {'^/server': ''},
					logLevel: 'debug',
				}
			}
		},
		plugins: []
	};

	if (mode == 'development') {
		config.devtool = 'eval-source-map';
	}

	return config;
};