import { Close, File, Upload } from "@navikt/ds-icons";
import { Button, ErrorMessage, Label } from "@navikt/ds-react";
import { ChangeEvent, DragEvent, useCallback, useState } from "react";
import { parseCSV } from "../helpers/utils";

function parseFile(
  file: File,
  onFileParsed: (prns: string[]) => void,
  onError: (this: FileReader, ev: ProgressEvent<FileReader>) => void,
) {
  const reader = new FileReader();
  reader.onload = (readerEvent) => {
    const text = readerEvent.target?.result as string | undefined | null;
    if (!text) return;
    let splitPnrs: string[];
    if (/^.*\.csv$/.test(file.name)) splitPnrs = parseCSV(text).map((row) => row[0]);
    else splitPnrs = text.split("\n");
    onFileParsed(splitPnrs);
  };
  reader.onerror = onError;
  reader.readAsText(file);
}

type UploadFileProps = {
  onFileChanged: (personnumre: string[]) => void;
};

export default function UploadFile(props: UploadFileProps) {
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [isDragged, setIsDragged] = useState(false);

  const parseFileUpdate = useCallback(
    (file?: File) => {
      if (file === undefined) return;
      setFileName(file.name);
      parseFile(file, props.onFileChanged, () =>
        setError("An error occurred while reading the file."),
      );
    },
    [setFileName, props.onFileChanged, setError],
  );

  const onFileChanged = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const file = e.target.files?.[0];
      parseFileUpdate(file);
    },
    [props.onFileChanged, parseFileUpdate],
  );

  const onFileDropped = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragged(false);
      const dropItem = e.dataTransfer.files[0];
      parseFileUpdate(dropItem);
    },
    [setIsDragged, props.onFileChanged, parseFileUpdate],
  );

  const onDivDrag = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragged(true);
    },
    [setIsDragged],
  );

  const onCloseFile = useCallback(() => {
    setFileName("");
    props.onFileChanged([]);
  }, [setFileName, props.onFileChanged]);

  return (
    <div
      className={`lg:w-1/2 w-full h-52 border-2 rounded-medium border-solid ${
        isDragged ? "border-blue-700" : "border-blue-200"
      } flex flex-col items-center`}
      onDrop={onFileDropped}
      onDragOver={onDivDrag}
      onDragLeave={() => setIsDragged(false)}
    >
      <input type="file" id="inputFile" onChange={onFileChanged} hidden />
      <Button as="label" htmlFor="inputFile" className="mt-20">
        <Upload /> Last opp fil
      </Button>
      <div className="h-5 mt-2">
        <span className="flex items-center">
          <Label className="mr-4">
            {!fileName ? (
              "Klikk på knappen eller dra inn filen hit."
            ) : (
              <>
                <File />
                {fileName}
              </>
            )}
          </Label>
          {fileName && (
            <Button
              variant="tertiary"
              size="small"
              onClick={onCloseFile}
              aria-label="Fjern fil"
              title="Fjern fil"
            >
              <Close color="red" />
            </Button>
          )}
        </span>
      </div>
      <ErrorMessage title="delete" className="mt-2">
        {error && `* ${error}`}
      </ErrorMessage>
    </div>
  );
}
