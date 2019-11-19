import React from 'react';

export default function payments(props) {
  const {supplierId} = props;

  return (
    <div>
      PAYMENTS for {supplierId}
    </div>
  );
}
