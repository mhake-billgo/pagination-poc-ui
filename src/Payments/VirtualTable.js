import React, {Fragment, useState, useEffect} from 'react';
import {Column, Table, InfiniteLoader} from 'react-virtualized';
import 'react-virtualized/styles.css';

export default function VirtualTable(props) {
  const [tableItems, setTableItems] = useState([]);
  const [loadPromiseResolver, setLoadPromiseResolver] = useState(undefined);
  const {loading, error, data, refetch, pageSize, supplierId} = props;
  const pageInfo = data ? data.supplier.transactionsConnection.pageInfo : undefined;
  const totalCount = data ? data.supplier.transactionsConnection.totalCount : undefined;

  useEffect(() => {
    const getDateStr = (timestamp) => {
      const date = new Date(parseInt(timestamp));
      return `${date.getFullYear()}-${(date.getMonth()+1)}-${(date.getDate()+1)}`;
    };

    if(data) {
      const newItems = data.supplier.transactionsConnection.edges.map(edge => {
        const { accountNumber, payFrom, grossAmount, depositTimestamp } = edge.node;
        return {
          payFromName:payFrom.name,
          grossAmount,
          accountNumber,
          date: getDateStr(depositTimestamp)
        };
      });
      //appendMorePayments(newItems);
      setTableItems(tableItems.concat(newItems));
      if(loadPromiseResolver) {
        loadPromiseResolver(); // Invoke the resolve of the infinite load promise
      }
    }
    // ESLint complains here that this effect uses setTableItems and tableItems but
    // does not list them in dependency array. This warning can be ignored
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  console.log('Payments loading, data, error, pageInfo:', loading, data, error, pageInfo);

  const loadMore = () => {
    // Only load more if there are more, otherwise do nothing
    if(totalCount > pageInfo.endCursor) {
      refetch({id:supplierId, pageSize:pageSize, after:pageInfo.endCursor});
      // Return a promise that is to be resolved when the additional data is loaded
      return new Promise((resolve, reject) => {
        setLoadPromiseResolver(resolve);
      })
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
