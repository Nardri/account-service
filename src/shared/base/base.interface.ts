abstract class ServiceAPIResponse<A> {
  abstract get data(): A;
}

export {
  // eslint-disable-next-line import/prefer-default-export
  ServiceAPIResponse,
};
