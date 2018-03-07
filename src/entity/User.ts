export class User {
  constructor (
    public id?: number,
    public username?: string,
    public password?: string,
    public email?: string,
    public authorization?: number,
    public userState?: number
  ) {}

  static translationUserRole (userRoleStr: string): string {
    return UserRole[userRoleStr]
  }
}

export enum UserRole {
  'visitor' = '游客',
  'normal' = '普通用户',
  'vip' = '管理员',
  'root' = '超级管理员'
}


