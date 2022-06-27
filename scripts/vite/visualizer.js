import visualizerFn from "rollup-plugin-visualizer";

export function visualizer() {
  return visualizerFn({
    filename: './node_modules/.cache/visualizer/stats.html',
    open: true,
    gzipSize: true,
    brotliSize: true
  });
}
