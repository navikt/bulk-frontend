import { ErrorMessage, Label } from "@navikt/ds-react";
import { ChangeEvent, useCallback, useState } from "react";
import { parseCSV } from "../../lib/utils";

type UploadFileProps = {
  onFileChanged: (personnumre: string[]) => void;
};

export default function UploadFile(props: UploadFileProps) {
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  const onFileChanged = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const file: File | undefined = e.target.files?.[0];
      if (file === undefined) return;
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const text = readerEvent.target?.result as string | undefined | null;
        if (!text) return;
        let filteredPnrs: string[];
        if (/^.*\.csv$/.test(file.name)) filteredPnrs = parseCSV(text).map((row) => row[0]);
        else filteredPnrs = text.split("\n");
        props.onFileChanged(filteredPnrs);
      };
      reader.onerror = () => {
        setError("An error occurred while reading the file.");
        reader.abort();
      };

      reader.readAsText(file);
    },
    [props.onFileChanged],
  );
  // className="navds-button navds-button--primary navds-button--medium"
  return (
    <div className="ml-12 mt-12">
      <input type="file" onChange={onFileChanged} id="inputFile" hidden />
      <label
        htmlFor="inputFile"
        className="navds-button navds-button--primary navds-button--medium self-start"
      >
        Last opp fil
      </label>
      <span>
        <Label>{fileName}</Label>
        <ErrorMessage>{error}</ErrorMessage>
      </span>
    </div>
  );
}
