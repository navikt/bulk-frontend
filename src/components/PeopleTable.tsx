import { Table } from "@navikt/ds-react";
import { ReactElement } from "react";

type ObjectTableProps = {
  table?: {
    [attribute: string]: string;
  }[];
};

export default function ObjectTable(props: ObjectTableProps): ReactElement {
  const firstKey = Object.keys(props.table?.[0] ?? [{ Personident: "123" }])[0];
  return (
    <Table size="medium" zebraStripes>
      <Table.Header>
        <Table.Row>
          {Object.keys(props.table?.[0] ?? {}).map((attr) => {
            return <Table.ColumnHeader key={attr}>{attr}</Table.ColumnHeader>;
          })}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {props.table?.map((row) => {
          return (
            <Table.Row key={row[firstKey]}>
              {Object.keys(row).map((attr) => (
                <Table.DataCell key={row[firstKey] + attr}>{row[attr]}</Table.DataCell>
              ))}
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
}
