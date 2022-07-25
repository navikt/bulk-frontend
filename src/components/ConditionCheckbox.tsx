import { Checkbox, ErrorMessage } from "@navikt/ds-react";
import { useCallback, useEffect, useRef, useState } from "react";

type CondiditionCheckboxProps = {
  title: string;
  condition: boolean;
  errorMessage?: string;
  onChange?: (checked: boolean) => void;
};

/**
 * A checkbox that restricts when it can be checked based on a condition.
 * If the checkbox cannot be checked because the condition is false, the errorMessage is shown.
 */
export default function CondiditionCheckbox(props: CondiditionCheckboxProps) {
  const [showTableChecked, setShowTableChecked] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const timeout = useRef<NodeJS.Timeout | null>(null);

  // Function to update the state and notify the above component about the state change.
  const handleSetChecked = useCallback(
    (checked: boolean) => {
      setShowTableChecked(checked);
      props.onChange?.(checked);
    },
    [props.onChange, setShowTableChecked],
  );

  // Function to set the showTableChecked state to false and show errorMessage.
  const setCheckedFalse = useCallback(() => {
    handleSetChecked(false);
    // Set the error message if defined and make it disappear after 7s
    if (!props.errorMessage) return;
    setError(props.errorMessage);
    timeout.current = setTimeout(() => {
      setError(undefined);
    }, 7000);
  }, [timeout, setShowTableChecked, setError, props.onChange]);

  // Function to handle checking of the checkbox
  const handleCheckboxChange = useCallback(
    (checked: boolean) => {
      timeout.current && clearTimeout(timeout.current);
      if (props.condition) return handleSetChecked(checked);
      // The checkbox is not eligble to check
      setCheckedFalse();
    },
    [props.condition, setShowTableChecked, handleSetChecked, props.onChange],
  );

  // If at any point the condition is false, uncheck and show errorMessage.
  useEffect(() => {
    if (!props.condition) setCheckedFalse();
  }, [props.condition]);

  return (
    <>
      <Checkbox checked={showTableChecked} onChange={(e) => handleCheckboxChange(e.target.checked)}>
        {props.title}
      </Checkbox>
      <ErrorMessage>{error && `* ${error}`}</ErrorMessage>
    </>
  );
}
