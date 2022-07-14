import { Checkbox } from "@navikt/ds-react";
import { ChangeEvent, useCallback, useState } from "react";

type UploadFileProps = {
  onFileChanged: (personnumre: string[]) => void;
};

export default function UploadFile(props: UploadFileProps) {
  const [skipFirstFileLine, setSkipFirstFileLine] = useState(false);

  const onFileChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const text = readerEvent.target?.result as string | undefined | null;
      if (!text) return;
      const filteredPnrs = text.split("\n");
      props.onFileChanged(filteredPnrs);
    };
    const file: File | undefined = e.target.files?.[0];
    if (file === undefined) return;
    reader.readAsText(file);
  }, []);

  return (
    <>
      <input type="file" onChange={onFileChanged} />
      <Checkbox
        checked={skipFirstFileLine}
        onChange={(e) => setSkipFirstFileLine(e.target.checked)}
      >
        Skip første linje i fil
      </Checkbox>
    </>
  );
}
