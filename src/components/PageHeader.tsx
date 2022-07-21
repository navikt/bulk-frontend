import { Header } from "@navikt/ds-react-internal";
import { ReactElement } from "react";

type PageHeaderProps = {
  title: string;
  userName: string;
};

export default function PageHeader(props: PageHeaderProps): ReactElement {
  return (
    <Header className="sticky top-0 z-40 justify-between">
      <Header.Title as="h1">{props.title}</Header.Title>
      <Header.User name={props.userName} />
    </Header>
  );
}
