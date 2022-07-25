import { Tabs } from "@navikt/ds-react";
import { ReactNode, useCallback, useState } from "react";

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
  const [chosenTab, setChosenTab] = useState("ComponentOne");

  const handleChange = useCallback(
    (tab: string) => {
      const thisTab = tab as TabIndex;
      setChosenTab(thisTab);
      props.onChange?.(thisTab);
    },
    [setChosenTab, props.onChange],
  );

  return (
    <Tabs
      onChange={handleChange}
      className="flex flex-col"
      defaultValue={props.defaultValue ?? "ComponentOne"}
      size="medium"
      aria-label={`Velg mellom fane ${props.labelOne} eller ${props.labelTwo}`}
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
      <div className="mt-4">
        <div hidden={chosenTab !== "ComponentOne"}>{props.ComponentOne}</div>
        <div hidden={chosenTab !== "ComponentTwo"}>{props.ComponentTwo}</div>
      </div>
    </Tabs>
  );
}
