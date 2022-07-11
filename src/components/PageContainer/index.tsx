import { Heading, Ingress } from "@navikt/ds-react";
import { ReactElement, ReactNode } from "react";
type PageContainerProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export default function PageContainer(props: PageContainerProps): ReactElement {
  return (
    <div>
      <Heading level="1" size="xlarge">
        {props.title}
      </Heading>
      <Ingress>{props.description}</Ingress>
      <div>{props.children}</div>
    </div>
  );
}
