import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback } from "react";

const Home: NextPage = () => {
  const router = useRouter();

  const onLogInClick = useCallback(() => {
    router.push("/main");
  }, [router]);

  return (
    <div>
      <button onClick={onLogInClick}>Logg inn</button>
    </div>
  );
};

export default Home;
