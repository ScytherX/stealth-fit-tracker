try {
  structuredClone({ weight: undefined });
  console.log("Clone success");
} catch(e) {
  console.error("Clone failed", e);
}
