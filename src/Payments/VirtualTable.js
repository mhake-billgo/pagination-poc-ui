import React, {Fragment} from 'react';
import {Column, Table, InfiniteLoader} from 'react-virtualized';
import 'react-virtualized/styles.css';

export default function VirtualTable(props) {
  const {loading, error, data, fetchMore, pageSize, supplierId} = props;
  const pageInfo = data ? data.supplier.transactionsConnection.pageInfo : undefined;
  const totalCount = data ? data.supplier.transactionsConnection.totalCount : undefined;

  if(error) {
    console.error("Error in VirtualTable",error);
  }
  const getDateStr = (timestamp) => {
    const date = new Date(parseInt(timestamp));
    return `${date.getFullYear()}-${(date.getMonth()+1)}-${(date.getDate()+1)}`;
  };

  let tableItems = [];
  if(data) {
    tableItems = data.supplier.transactionsConnection.edges.map(edge => {
      const {accountNumber, payFrom, grossAmount, depositTimestamp} = edge.node;
      return {
        payFromName: payFrom.name,
        grossAmount,
        accountNumber,
        date: getDateStr(depositTimestamp)
      };
    });
  };

  const loadMore = () => {
    // Only load more if there are more, otherwise do nothing
    if(!loading && totalCount > pageInfo.endCursor) {
      fetchMore({
        variables: {id:supplierId, pageSize:pageSize, after:pageInfo.endCursor},
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const previousEdges = previousResult.supplier.transactionsConnection.edges;
          const newEdges = fetchMoreResult.supplier.transactionsConnection.edges;

          return {
            supplier: {
              transactionsConnection: {
                totalCount: previousResult.supplier.transactionsConnection.totalCount,
                pageInfo: {
                  startCursor: previousResult.supplier.transactionsConnection.pageInfo.startCursor,
                  endCursor: fetchMoreResult.supplier.transactionsConnection.pageInfo.endCursor,
                  hasNextPage: fetchMoreResult.supplier.transactionsConnection.pageInfo.hasNextPage,
                  hasPreviousPage: previousResult.supplier.transactionsConnection.pageInfo.hasPreviousPage,
                  __typename: 'PageInfo'
                },
                edges: [...previousEdges, ...newEdges],
                __typename: 'SupplierTransactionsConnection'
              },
              __typename: 'Supplier'
            },
          };
        }
      });
    }
  };

  return (
    <Fragment>
      <InfiniteLoader
        isRowLoaded={({ index}) => !!tableItems[index]}
        loadMoreRows={loadMore}
        rowCount={1000000}
      >
        {({onRowsRendered, registerChild}) => (
          <Table
            ref={registerChild}
            onRowsRendered={onRowsRendered}
            width={900}
            height={300}
            headerHeight={20}
            rowHeight={30}
            rowCount={tableItems.length}
            rowGetter={({index}) => tableItems[index]}>
            <Column label="From" dataKey="payFromName" width={300} />
            <Column label="Amount" dataKey="grossAmount" width={300} />
            <Column label="Account" dataKey="accountNumber" width={300} />
            <Column label="Date" dataKey="date" width={300} />
          </Table>
        )}
      </InfiniteLoader>
      { pageInfo && loading && <span>Loading records {parseInt(pageInfo.endCursor)+ 1} to {parseInt(pageInfo.endCursor) + parseInt(pageSize)}...</span>}
    </Fragment>
  );
}
