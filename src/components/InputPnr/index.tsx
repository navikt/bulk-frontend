import { Textarea } from "@navikt/ds-react";
import { ChangeEvent, useCallback, useState } from "react";
import { debounce } from "../../lib/utils";

type InputPnrProps = {
  onInputDebounce: (personnrs: string[]) => void;
};

const debounceUpdate = debounce((onDebounce: (pnrs: string) => void, pnrs: string) =>
  onDebounce(pnrs),
);

export default function InputPnr(props: InputPnrProps) {
  const [personnumre, setPersonnumre] = useState("");

  const onDebounce = useCallback(
    (personnumrearg: string) => {
      const pnrsArray = personnumrearg.split("\n");
      props.onInputDebounce(pnrsArray);
    },
    [props.onInputDebounce],
  );

  const onPersonnumreChanged = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const valueFiltered = value.match(/[0-9\n]+/g)?.join("") ?? "";
    setPersonnumre(valueFiltered);
    debounceUpdate(onDebounce, valueFiltered);
  };

  return (
    <Textarea
      label="Oppgi personnumre"
      size="medium"
      className="w-1/3 mt-4"
      value={personnumre}
      onChange={onPersonnumreChanged}
    />
  );
}
