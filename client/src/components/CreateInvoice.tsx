import React, { FC } from 'react';
import styled from 'styled-components';

const CreateInvoiceText = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 50px;
    height: 70vh;
`;

const CreateInvoice: FC = () => {
    return (
        <CreateInvoiceText>Add new invoice, coming soon</CreateInvoiceText>
    )
};

export default CreateInvoice;