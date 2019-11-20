import React from 'react';
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
  const { loading, error, data, refetch } = useQuery(PAYMENTS,{variables: {id: supplierId, pageSize: 20}});

  const edges = data ? data.supplier.transactionsConnection.edges : [];
  const pageInfo = data ? data.supplier.transactionsConnection.pageInfo : undefined;
  const totalCount = data ? data.supplier.transactionsConnection.totalCount : undefined;

  const nextPage = () => {
      console.log('next');
      refetch({id: supplierId, pageSize: 20, after:pageInfo.endCursor});
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

        { pageInfo != null &&
        <React.Fragment>
            <span>Displaying {pageInfo.startCursor} to {pageInfo.endCursor} of: {totalCount}</span>
            <button>Previous</button>
            <button onClick={nextPage}>Next</button>
        </React.Fragment>
        }
    </div>

  );
}
