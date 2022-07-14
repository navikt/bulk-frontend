import { ChangeEvent, useCallback } from "react";
import { parseCSV } from "../../lib/utils";

type UploadFileProps = {
  onFileChanged: (personnumre: string[]) => void;
};

export default function UploadFile(props: UploadFileProps) {
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
        props.onFileChanged(filteredPnrs);
      };
      reader.readAsText(file);
    },
    [props.onFileChanged],
  );

  return (
    <>
      <input type="file" onChange={onFileChanged} />
    </>
  );
}
