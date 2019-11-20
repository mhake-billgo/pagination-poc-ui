import React, {useState} from 'react';
import gql from "graphql-tag";
import {useQuery} from "@apollo/react-hooks";
import PaginatedTable from "./PaginatedTable";
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

export default function Payments(props) {
  const {supplierId} = props;
  const [pageSize, setPageSize] = useState(20);
  const { loading, error, data, refetch } = useQuery(PAYMENTS,{variables: {id:supplierId, pageSize:pageSize}});

  return (
    <div className='payments'>
        <h2>PAYMENTS</h2>
        <PaginatedTable loading={loading} error={error} data={data} refetch={refetch} supplierId={supplierId} pageSize={pageSize} setPageSize={setPageSize}/>
    </div>

  );
}
