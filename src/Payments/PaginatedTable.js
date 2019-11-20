import React from 'react';
import './payments.css';

const getDateStr = (timestamp) => {
  const date = new Date(parseInt(timestamp));
  return `${date.getFullYear()}-${(date.getMonth()+1)}-${(date.getDate()+1)}`;
};

const renderTableData = (edges) => {
  return edges.map((edge, index) => {
    const { accountNumber, payFrom, grossAmount, depositTimestamp } = edge.node;
    return (
      <tr key={index}>
        <td>{payFrom.name}</td>
        <td>{grossAmount}</td>
        <td>{accountNumber}</td>
        <td>{getDateStr(depositTimestamp)}</td>
      </tr>
    );
  })
};

export default function PaginatedTable(props) {
  const {loading, error, data, refetch, pageSize, setPageSize, supplierId} = props;
  const edges = data ? data.supplier.transactionsConnection.edges : [];
  const pageInfo = data ? data.supplier.transactionsConnection.pageInfo : undefined;
  const totalCount = data ? data.supplier.transactionsConnection.totalCount : undefined;

  const nextPage = () => {
    if(totalCount > pageInfo.endCursor) {
      refetch({id:supplierId, pageSize:pageSize, after:pageInfo.endCursor});
    } else {
      console.warn('No more pages');
    }
  };

  const prevPage = () => {
    const after = pageInfo.startCursor-(pageSize+1);
    if(after >= 0) {
      // Dont try to fetch starting at a negative number
      refetch({id:supplierId, pageSize:pageSize, after:after});
    } else {
      console.warn("Not fetching starting with record: ", after);
    }
  };

  const onPageSizeChange = (event) => {
    setPageSize(event.target.value);
  };

  console.log('Payments loading, data, error, pageInfo:', loading, data, error, pageInfo);
  return (
    <div className='payments'>
      <table>
        <tbody>
        <tr>
          <th>From</th>
          <th>Amount</th>
          <th>Account</th>
          <th>Date</th>
        </tr>
        {renderTableData(edges)}
        </tbody>
      </table>

      { loading && <span>Loading...</span> }

      { !loading && pageInfo != null &&
      <div className='payments__pagination'>
        <span>Displaying {pageInfo.startCursor} to {pageInfo.endCursor} of: {totalCount}</span>

        <button className='payments__pagination_button' onClick={prevPage}>Previous</button>
        <button className='payments__pagination_button' onClick={nextPage}>Next</button>
        <label className='payments__pagination_selectlabel' htmlFor='pageSize'>Page Size</label>
        <select className='payments__pagination_select' id='pageSize' onChange={onPageSizeChange} value={pageSize}>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
      }
    </div>

  );
}
