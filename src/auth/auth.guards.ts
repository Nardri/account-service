// import { AuthGuard } from '@nestjs/passport';
// import { ForbiddenException } from '@nestjs/common';
//
// export default class MyAuthGuard extends AuthGuard('jwt') {
//   handleRequest(err: any, user: any, info: any, context: any): any  {
//     console.log('context', user);
//     console.log('err', err);
//
//     if (err || !user) {
//       throw err || new ForbiddenException();
//     }
//
//     return user;
//   }
// }
