const EmptyInput = { promise: null };
const emptyInputPromise = Promise.resolve(EmptyInput);
EmptyInput.promise = () => emptyInputPromise