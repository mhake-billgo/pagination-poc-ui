import React from 'react';
import gql from "graphql-tag";
import {useQuery} from "@apollo/react-hooks";
import './payments.css';


const PAYMENTS = gql`  
        query supplier($id: String!){
            supplier(id: $id){
                legalName
                transactionsConnection (first: 10000) {
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

const renderTableData = (edges) => {
    return edges.map((edge, index) => {
        const { accountNumber, payFrom, grossAmount } = edge.node;
        return (
          <tr key={index}>
              <td>{payFrom.name}</td>
              <td>{grossAmount}</td>
              <td>{accountNumber}</td>

          </tr>
        )
    })
};

export default function Payments(props) {
  const {supplierId} = props;
  const { loading, error, data } = useQuery(PAYMENTS,{variables: { id: supplierId }});

  const edges = data ? data.supplier.transactionsConnection.edges : [];
  const pageInfo = data ? data.supplier.transactionsConnection.pageInfo : undefined;
  const totalCount = data ? data.supplier.transactionsConnection.totalCount : undefined;

  console.log('Payments loading, data, error, pageInfo:', loading, data, error, pageInfo);
  return (
    <div className='payments'>
        <h2>PAYMENTS</h2>

        { pageInfo != null &&
            <span>Displaying {pageInfo.startCursor} to {pageInfo.endCursor} of: {totalCount}</span>
        }

        <table>
            <tbody>
                <tr>
                    <th>From</th>
                    <th>Amount</th>
                    <th>Account</th>
                </tr>
                {renderTableData(edges)}
            </tbody>
        </table>
    </div>

  );
}
