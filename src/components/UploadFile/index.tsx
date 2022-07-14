import { Checkbox } from "@navikt/ds-react";
import { ChangeEvent, useCallback, useState } from "react";
import { parseCSV } from "../../lib/utils";

type UploadFileProps = {
  onFileChanged: (personnumre: string[]) => void;
};

export default function UploadFile(props: UploadFileProps) {
  const [skipFirstFileLine, setSkipFirstFileLine] = useState(false);

  const onFileChanged = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const file: File | undefined = e.target.files?.[0];
      if (file === undefined) return;
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const text = readerEvent.target?.result as string | undefined | null;
        if (!text) return;
        let filteredPnrs: string[];
        if (/^.*\.csv$/.test(file.name)) filteredPnrs = parseCSV(text).map((row) => row[0]);
        else filteredPnrs = text.split("\n");
        console.log("filetered", filteredPnrs);

        props.onFileChanged(filteredPnrs);
      };
      reader.readAsText(file);
      // If csv file
    },
    [props.onFileChanged],
  );

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
