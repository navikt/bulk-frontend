import { Heading, Ingress } from "@navikt/ds-react";
import { ReactElement, ReactNode } from "react";

type PageContainerProps = {
  title: string;
  ingress?: string;
  description?: string;
  tableNode?: ReactNode;
  children: ReactNode;
};

export default function PageContainer(props: PageContainerProps): ReactElement {
  return (
    <div className="flex flex-col w-full items-center h-full">
      <div className="w-2/3 mt-10">
        <Heading level="1" size="xlarge">
          {props.title}
        </Heading>
        {props.ingress != undefined ? (
          <Ingress className="w-4/5 mt-6">{props.ingress}</Ingress>
        ) : (
          ""
        )}
        {props.description != undefined ? (
          <Ingress className="w-4/5 mt-5">{props.description}</Ingress>
        ) : (
          ""
        )}
        {props.children}
      </div>
      <div className="flex w-full justify-center min-w-fit">
        <div className="min-w-fit xl:min-w-[70em]">{props.tableNode}</div>
      </div>
      <div className="h-20"></div>
    </div>
  );
}
