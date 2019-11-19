import React from 'react';
import gql from "graphql-tag";
import {useQuery} from "@apollo/react-hooks";


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

export default function Payments(props) {
  const {supplierId} = props;
  const { loading, error, data } = useQuery(PAYMENTS,{variables: { id: supplierId }});

  console.log('payments loading, data, error:',loading, data, error);
  return (
    <div>
      PAYMENTS for {supplierId}
    </div>
  );
}
