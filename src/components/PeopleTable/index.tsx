import { Table } from "@navikt/ds-react";
import { ReactElement } from "react";
import { KRRResponse } from "../../lib/types";

type PeopleTableProps = {
  peopleResponse?: KRRResponse;
};

export default function PeopleTable(props: PeopleTableProps): ReactElement {
  return (
    <Table size="medium" zebraStripes>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Personnummer</Table.ColumnHeader>
          <Table.ColumnHeader>Språk</Table.ColumnHeader>
          <Table.ColumnHeader>E-post</Table.ColumnHeader>
          <Table.ColumnHeader>Mobilnummer</Table.ColumnHeader>
          <Table.ColumnHeader>Adresse</Table.ColumnHeader>
          <Table.ColumnHeader>Feil</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {Object.keys(props.peopleResponse?.personer ?? {}).map((pnr: string) => {
          const personData = props.peopleResponse?.personer[pnr];
          const person = personData?.person;
          return (
            <Table.Row key={pnr}>
              <Table.HeaderCell>{pnr}</Table.HeaderCell>
              <Table.DataCell>{person?.spraak ?? "-"}</Table.DataCell>
              <Table.DataCell>{person?.epostadresse ?? "-"}</Table.DataCell>
              <Table.DataCell>{person?.mobiltelefonnummer ?? "-"}</Table.DataCell>
              <Table.DataCell>{person?.adresse ?? "-"}</Table.DataCell>
              <Table.DataCell>{personData?.feil ?? "-"}</Table.DataCell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
}
