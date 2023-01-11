import {
  createContext,
  ReactNode,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { AuthStatus, User } from "../interfaces";

interface UserContextInterface {
  token: string;
  setToken: Dispatch<SetStateAction<string>>;
  signInStatus: AuthStatus;
  user: User | null;
  getUserInfo: Function;
}

export const userContext = createContext<UserContextInterface>(
  {} as UserContextInterface
);

export default function UserContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [token, setToken] = useState<string>();
  const [signInStatus, setSignInStatus] = useState<AuthStatus>(
    AuthStatus.LOADING
  );
  const [user, setUser] = useState<User | null>(null);

  const getUserInfo = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/User`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setUser(await response.json());
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    setToken(localStorage.getItem("token") || "");
  }, []);

  useEffect(() => {
    if (token?.length > 1) {
      localStorage.setItem("token", token);
      setSignInStatus(AuthStatus.SIGNEDIN);
      getUserInfo();
    } else if (token === "") {
      setSignInStatus(AuthStatus.NOTSIGNEDIN);
    }
  }, [token]);

  return (
    <userContext.Provider
      value={{
        token,
        setToken,
        signInStatus,
        user,
        getUserInfo,
      }}
    >
      {children}
    </userContext.Provider>
  );
}
