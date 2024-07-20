export const performanceBenchmark = (cb: () => any) => {
  const t0 = performance.now();
  cb();
  const t1 = performance.now();
  console.log("Performance (ms):", t1 - t0);
};
