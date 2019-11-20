import React, {useState} from 'react';
import gql from "graphql-tag";
import {useQuery} from "@apollo/react-hooks";
import './payments.css';


const PAYMENTS = gql`  
        query supplier($id: String! $pageSize: Int! $after: String){
            supplier(id: $id){
                legalName
                transactionsConnection (first: $pageSize after: $after) {
                    totalCount
                    pageInfo {
                        startCursor
                        endCursor
                        hasNextPage
                        hasPreviousPage
                    }
                    edges {
                        node {
                            ... on Payment {
                                id
                                depositTimestamp
                                payFrom {
                                    name
                                    phoneNumber
                                    address {
                                        line1
                                        line2
                                        city
                                        state
                                        zipCode
                                    }
                                }
                                payTo {
                                    name
                                    address {
                                        line1
                                        line2
                                        city
                                        state
                                        zipCode
                                    }
                                }
                                grossAmount
                                netAmount
                                accountNumber
                                currency
                                events {
                                    eventType
                                    timestamp
                                    description
                                }
                            }
                            ... on Return {
                                id
                                returnCode
                                createdTimestamp
                                withdrawTimestamp
                                payment {
                                    id
                                    depositTimestamp
                                    payFrom {
                                        name
                                        phoneNumber
                                        address {
                                            line1
                                            line2
                                            city
                                            state
                                            zipCode
                                        }
                                    }
                                    payTo {
                                        name
                                        address {
                                            line1
                                            line2
                                            city
                                            state
                                            zipCode
                                        }
                                    }
                                    grossAmount
                                    netAmount
                                    accountNumber
                                    currency
                                    events {
                                        eventType
                                        timestamp
                                        description
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
`;

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

export default function Payments(props) {
  const {supplierId} = props;
  const [pageSize, setPageSize] = useState(20);
  const { loading, error, data, refetch } = useQuery(PAYMENTS,{variables: {id:supplierId, pageSize:pageSize}});
  const edges = data ? data.supplier.transactionsConnection.edges : [];
  const pageInfo = data ? data.supplier.transactionsConnection.pageInfo : undefined;
  const totalCount = data ? data.supplier.transactionsConnection.totalCount : undefined;

  const nextPage = () => {
      refetch({id:supplierId, pageSize:pageSize, after:pageInfo.endCursor});
  };

   const prevPage = () => {
       const after = pageInfo.startCursor-(pageSize+1);
       refetch({id:supplierId, pageSize:pageSize, after:after});
   };

  console.log('Payments loading, data, error, pageInfo:', loading, data, error, pageInfo);
  return (
    <div className='payments'>
        <h2>PAYMENTS</h2>

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
        </div>
        }
    </div>

  );
}
