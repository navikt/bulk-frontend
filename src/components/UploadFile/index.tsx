import { Close, File, Upload } from "@navikt/ds-icons";
import { Button, ErrorMessage, Label } from "@navikt/ds-react";
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
        let splitPnrs: string[];
        if (/^.*\.csv$/.test(file.name)) splitPnrs = parseCSV(text).map((row) => row[0]);
        else splitPnrs = text.split("\n");
        props.onFileChanged(splitPnrs);
      };
      reader.onerror = () => {
        setError("An error occurred while reading the file.");
      };

      reader.readAsText(file);
    },
    [props.onFileChanged],
  );

  const onCloseFile = useCallback(() => {
    setFileName("");
    props.onFileChanged([]);
  }, [setFileName]);
  // className="navds-button navds-button--primary navds-button--medium"
  return (
    <div className="py-5">
      <input type="file" id="inputFile" onChange={onFileChanged} hidden />
      <Button as="label" htmlFor="inputFile">
        <Upload /> Last opp fil
      </Button>
      <div className="h-5 mt-4">
        {fileName && (
          <span className="flex items-center">
            <Label className="mr-4">
              <File />
              {fileName}
            </Label>
            <Button variant="tertiary" size="small" onClick={onCloseFile} aria-label="lukk fil">
              <Close color="red" />
            </Button>
          </span>
        )}
      </div>
      <ErrorMessage>{error && `* ${error}`}</ErrorMessage>
    </div>
  );
}
