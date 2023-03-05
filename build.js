const { dependencies, peerDependencies } = require('./package.json')
const { Generator } = require('npm-dts');

new Generator({
  entry: 'src/index.ts',
  output: 'dist/index.d.ts',
}).generate();

const sharedConfig = {
  external: Object.keys(dependencies).concat(Object.keys(peerDependencies)),
  entryPoints: ["src/index.ts"],
  drop: ['debugger', 'console'],
  treeShaking: true
};

// Intended for CDN
build({
  ...sharedConfig,
  outfile: "dist/index.js",
  bundle: true,
  platform: 'browser',
});

build({
  ...sharedConfig,
  outfile: "dist/index.min.js",
  bundle: true,
  minify: true,
  platform: 'browser',
});

// The ESM one is meant for "import" statements (bundlers and new browsers)
build({
  ...sharedConfig,
  outfile: "dist/index.esm.js",
  bundle: true,
  platform: 'neutral',
  mainFields: ['module', 'main'],
});

// The cjs one is meant for "require" statements (node)
build({
  ...sharedConfig,
  outfile: "dist/index.cjs.js",
  bundle: true,
  target: ['node10.4'],
  platform: 'node',
});

async function build(options) {
  try {
    return await require('esbuild').build({
      ...options,
    });
  } catch {
    return process.exit(1);
  }
};