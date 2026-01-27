import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { AppwriteException, ID, Models } from "appwrite";
import { account } from "../models/client/config";

export interface userPrefs {
  reputation: number;
  fcmToken: string;
  isRegisteredForNotification: boolean;
}

interface IAuthStore {
  session: Models.Session | null;
  jwt: string | null;
  user: Models.User<userPrefs> | null;
  hydrated: boolean;

  setHydrated(): void;
  verifySession(): Promise<void>;
  login(
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: AppwriteException | null }>;
  createAccount(
    name: string,
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: AppwriteException | null }>;
  logout(): Promise<void>;
}

export const useAuthStore = create<IAuthStore>()(
  persist(
    immer((set) => ({
      session: null,
      jwt: null,
      user: null,
      hydrated: false,

      setHydrated() {
        set({ hydrated: true });
      },

      async verifySession() {
        try {
          const session = await account.getSession("current");
          const user = await account.get<userPrefs>();
          set({ session, user });
        } catch (error) {
          console.log(error);
        }
      },

      async login(email: string, password: string) {
        try {
          const session = await account.createEmailPasswordSession(
            email,
            password,
          );
          const [user, { jwt }] = await Promise.all([
            account.get<userPrefs>(),
            account.createJWT(),
          ]);

          const currentPrefs = user.prefs ?? {};

          const res = await account.updatePrefs<userPrefs>({
            ...currentPrefs,
            reputation: currentPrefs.reputation ?? 0,
            isRegisteredForNotification: false,
            fcmToken: "",
          });

          set({ session, user, jwt });
          return { success: true, user: res };
        } catch (error) {
          console.log(error);
          return {
            success: false,
            error: error instanceof AppwriteException ? error : null,
          };
        }
      },

      async createAccount(name: string, email: string, password: string) {
        try {
          await account.create(ID.unique(), email, password, name);
          return { success: true };
        } catch (error) {
          console.log(error);
          return {
            success: false,
            error: error instanceof AppwriteException ? error : null,
          };
        }
      },

      async logout() {
        try {
          await account.deleteSessions();
          localStorage.clear();
        } catch (error) {
          console.log(error);
        } finally {
          set({ session: null, jwt: null, user: null });
        }
      },
    })),
    {
      name: "auth",
      onRehydrateStorage() {
        return (state, error) => {
          if (!error) state?.setHydrated();
        };
      },
    },
  ),
);
