import React, {Fragment} from 'react';
import {Column, Table} from 'react-virtualized';
import 'react-virtualized/styles.css';

// const list = [
//   {payFromName:'Brian Vaughn', grossAmount: '123.33', accountNumber: 'ABC-123', depositTimestamp:'123333333333'},
// ];

export default function VirtualTable(props) {
  const {loading, error, data, refetch, pageSize, setPageSize, supplierId} = props;
  const edges = data ? data.supplier.transactionsConnection.edges : [];
  const pageInfo = data ? data.supplier.transactionsConnection.pageInfo : undefined;
  const totalCount = data ? data.supplier.transactionsConnection.totalCount : undefined;

  const list = edges.map(edge => {
    const { accountNumber, payFrom, grossAmount, depositTimestamp } = edge.node;
    return {
      payFromName:payFrom.name,
      grossAmount,
      accountNumber,
      depositTimestamp
    };
  });

  console.log('Payments loading, data, error, pageInfo:', loading, data, error, pageInfo);
  return (
    <Fragment>
      <Table
        width={900}
        height={300}
        headerHeight={20}
        rowHeight={30}
        rowCount={list.length}
        rowGetter={({index}) => list[index]}>
        <Column label="From" dataKey="payFromName" width={300} />
        <Column label="Amount" dataKey="grossAmount" width={300} />
        <Column label="Account" dataKey="accountNumber" width={300} />
        <Column label="Date" dataKey="depositTimestamp" width={300} />

      </Table>
    </Fragment>
  );
}
