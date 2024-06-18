try {
  throw new Error();
} catch (error) {
  console.log(typeof error);
}
