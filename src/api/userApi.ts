import { api } from './api.ts';

export interface UserInfo {
  email: string;
  nickname: string;
  major: string | null;
  score: string | null;
  introduction: string | null;
  status: "GRADE1" | "GRADE2" | "GRADE3" | "GRADE4" | "BREAK" | "EXCEED" | "DEFERRED" | "GRADUATESCHOOL" | "STAFF" | "NONE";
}

export const getUserInfo = async (): Promise<UserInfo> => {
  const response = await api.get<{ data: UserInfo }>('/api/v1/users/infos');
  return response.data.data;
};

export const updateUserInfo = async (userInfo: Partial<UserInfo>): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { email, ...dataToSend } = userInfo;
  await api.put('/api/v1/users/infos', dataToSend);
};
