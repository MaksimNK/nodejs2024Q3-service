export interface CreateUserDto {
  login: string;
  password: string;
}
export interface GetUserDto {
  id: string;
  login: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}

export interface UpdatePasswordDto {
  oldPassword: string;
  newPassword: string;
}
