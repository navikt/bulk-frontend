import { Header } from "@navikt/ds-react-internal";
import { ReactElement } from "react";
import { useAuthPayload } from "../../lib/hooks";

type PageHeaderProps = {
  title: string;
  userFullName: string;
};

export default function PageHeader(props: PageHeaderProps): ReactElement {
  const authPayload = useAuthPayload();
  return (
    <Header className="sticky top-0 z-40 justify-between">
      <Header.Title as="h1">{props.title}</Header.Title>
      <Header.User name={authPayload["name"]} />
    </Header>
  );
}
