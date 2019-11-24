import RoleEntity from '../../access-control/roles.entity';
import ServicesEntity from '../../access-control/services.entity';

// eslint-disable-next-line import/prefer-default-export
export abstract class ServiceAPIResponse<A> {
  abstract get data(): A;
}

export interface IRoleService {
  role: RoleEntity;
  service: ServicesEntity;
}
