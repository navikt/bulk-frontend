import { Heading, Ingress } from "@navikt/ds-react";
import { ReactElement, ReactNode } from "react";

type PageContainerProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export default function PageContainer(props: PageContainerProps): ReactElement {
  return (
    <div className="flex w-full justify-center h-full">
      <div className="w-2/3 mt-10">
        <Heading level="1" size="xlarge">
          {props.title}
        </Heading>
        <Ingress className="mt-4">{props.description}</Ingress>
        <div>{props.children}</div>
      </div>
    </div>
  );
}
