// eslint-disable-next-line import/prefer-default-export
export abstract class ServiceAPIResponse<A> {
  abstract get data(): A;
}
