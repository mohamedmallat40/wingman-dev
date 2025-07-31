import { type IUserProfile } from '@root/modules/profile/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  user?: IUserProfile;
  setUser: (user: IUserProfile) => void;
  removeUser: () => void;
}
const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: undefined,
      setUser: (user: IUserProfile) => {
        set(() => ({ user: user }));
      },
      removeUser: () => {
        set(() => ({ user: undefined }));
      }
    }),
    { name: 'user-store' }
  )
);

export default useUserStore;
