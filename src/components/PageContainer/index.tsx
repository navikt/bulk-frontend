import { Heading, Ingress } from "@navikt/ds-react";
import { ReactElement, ReactNode } from "react";

type PageContainerProps = {
  title: string;
  ingress?: string;
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
        {props.ingress != undefined ? (
          <Ingress className="w-3/5 mt-6">{props.ingress}</Ingress>
        ) : (
          ""
        )}
        {props.description != undefined ? (
          <Ingress className="w-3/5 mt-5">{props.description}</Ingress>
        ) : (
          ""
        )}
        {props.children}
      </div>
    </div>
  );
}
