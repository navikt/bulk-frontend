import { Tabs } from "@navikt/ds-react";
import { ReactNode } from "react";

export type TabIndex = "ComponentOne" | "ComponentTwo";

type TabComponentProps = {
  ComponentOne: ReactNode;
  ComponentTwo: ReactNode;
  labelOne?: string;
  labelTwo?: string;
  iconOne?: ReactNode;
  iconTwo?: ReactNode;
  defaultValue?: TabIndex;
  onChange?: (tab: TabIndex) => void;
};

export default function TabComponent(props: TabComponentProps) {
  return (
    <Tabs
      onChange={(tab: string) => props.onChange?.(tab as TabIndex)}
      className="flex flex-col mt-8"
      defaultValue={props.defaultValue ?? "ComponentOne"}
      size="medium"
    >
      <Tabs.List>
        <Tabs.Tab
          value="ComponentOne"
          iconPosition="left"
          label={props.labelOne}
          icon={props.iconOne}
        />
        <Tabs.Tab
          value="ComponentTwo"
          iconPosition="left"
          label={props.labelTwo}
          icon={props.iconTwo}
        />
      </Tabs.List>
      <Tabs.Panel value="ComponentOne" className="w-full bg-gray-50 p-8">
        {props.ComponentOne}
      </Tabs.Panel>
      <Tabs.Panel value="ComponentTwo" className="w-full bg-gray-50 p-8">
        {props.ComponentTwo}
      </Tabs.Panel>
    </Tabs>
  );
}
