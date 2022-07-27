import { Header } from "@navikt/ds-react-internal";
import { ReactElement } from "react";
import { useAuthPayload } from "../lib/hooks";
import logo from "../styles/logo.svg";

type PageHeaderProps = {
  title: string;
};

export default function PageHeader(props: PageHeaderProps): ReactElement {
  const authPayload = useAuthPayload();
  const name = authPayload?.name ?? "";
  return (
    <Header className="sticky top-0 z-40 justify-between">
      <h1
        className="text-base ml-3 mt-0 mb-0 pr-3"
        style={{
          borderRight: "1px solid var(--navdsi-header-color-border)",
          lineHeight: "3rem",
        }}
      >
        {props.title}
      </h1>
      <img className="mr-auto ml-3" src={logo.src} alt="" />
      <Header.User name={name} />
    </Header>
  );
}
