import { Textarea } from "@navikt/ds-react";
import { ChangeEvent, useState } from "react";

type InputPnrProps = {
  onInputChange: (personnrs: string[]) => void;
};

export default function InputPnr(props: InputPnrProps) {
  const [personnumre, setPersonnumre] = useState("");

  const onPersonnumreChanged = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const valueFiltered = value.match(/[0-9\n]+/g)?.join("") ?? "";
    setPersonnumre(valueFiltered);
    const pnrsArray = valueFiltered.split("\n");
    props.onInputChange(pnrsArray);
  };

  return (
    <Textarea
      label="Oppgi personnumre"
      size="medium"
      className="w-1/3 my-4"
      value={personnumre}
      onChange={onPersonnumreChanged}
    />
  );
}
