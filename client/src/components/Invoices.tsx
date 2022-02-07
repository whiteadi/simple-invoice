import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";

import { Invoice, InvoiceItem } from '../types';
import { StatusTypes } from '../constants';
import { getItems } from '../api';

const StyleWrap = styled.div`
  td {
    width: 10%;
    cursor: pointer;
    &:nth-child(2){
      width: 60%;
    }
  }
  tr.overdue td {
    background-color: #ffd3d3;
  }
  .btn {
    margin: 2px;
  }
`;
const StyledButton = styled.button`
  background: 'white';
  color: blue;
  font-size: 12px;
  padding: 2px;
  font-family: sans-serif;
  border-radius: 2px;
  text-align: center;
  margin: 2px;
  border: '3px solid black';
  &:hover {
    cursor: pointer;
  }
`;

const StyledLink = styled.a`
  background: 'blue';
  color: green;
  text-decoration: none;
  font-size: 12px;
  padding: 1rem;
  font-family: sans-serif;
  border-radius: 5px;
  text-align: center;
  margin: 5px;
  border: '3px solid black';
`;

type InvoicesProps = {
    invoices: Array<Invoice>,
    handleDelete: (id: number) => void,
};

const getInvoiceTotal = async (invoiceId: number): Promise<number> => {
    const items = await getItems(invoiceId);
    const total: number = items.reduce((acc: number, item: InvoiceItem) => (acc + item.price), 0);
    return total;
};

const getTotal = async (invoices: Array<Invoice>) => {
    let total = 0;
    for (const invoice of invoices) {
        const invoiceTotal = await getInvoiceTotal(invoice.id);
        total = total + invoiceTotal;
    }
    return total;
};

type InvoicesTotalProps = {
    id: number,
    total: number,
};

const Invoices = ({ invoices, handleDelete }: InvoicesProps): JSX.Element => {
    const [total, setTotal] = useState(0);
    const [totalPerInvoice, setTotalPerInvoice] = useState<InvoicesTotalProps[] | []>([]);

    useEffect(() => {
        getTotal(invoices).then(sum => setTotal(sum));
    }, [invoices]);

    useEffect(() => {
        for (const invoice of invoices) {
            getItems(invoice.id).then(items => {
                const totalInvoice: number = items.reduce((acc: number, item: InvoiceItem) => (acc + item.price), 0);
                setTotalPerInvoice([
                    ...totalPerInvoice,
                    {
                        id: invoice.id,
                        total: totalInvoice,
                    }
                ]);
            });
        }
    }, [invoices, totalPerInvoice]);

    const navigate = useNavigate();
    type ButtonProps = {
        href?: string,
        text: string,
        onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    };
    const Button = ({ href, text, onClick }: ButtonProps) => (
        href
            ? <StyledLink href={href}>
                {text}
            </StyledLink>
            : <StyledButton onClick={onClick}>
                {text}
            </StyledButton>
    );
    const newURL = '/invoice';
    const deleteInvoice = useCallback((id) => handleDelete(id), [handleDelete]);

    const getInvoiceRow = (invoice: Invoice, totalForInvoice: InvoicesTotalProps[]) => {
        const mailSubject = encodeURI(`Invoice: ${invoice.name}`);
        const mailBody =
            `Please view your invoice at this web page: http://example.com/invoices/${invoice.id}`;
        const mailTo = `mailto:?subject=${mailSubject}&body=${mailBody}`;
        const overdue =
            invoice.status === StatusTypes.OPEN && (new Date(invoice.due_date).getTime() - new Date().getTime() <= 0);
        const editURL = `/edit/${invoice.id}`;

        return (
            <tr
                key={invoice.id}
                onClick={() => navigate(editURL)}
                background-color={overdue ? 'red' : 'white'}
            >
                <td>{invoice.due_date}</td>
                <td>{invoice.name}</td>
                <td>{(totalForInvoice.find(totalObj => totalObj.id === invoice.id)?.total)?.toLocaleString("en-US")}</td>
                <td>{invoice.status}</td>
                <td>
                    {/* EDIT BUTTON */}
                    <Button href={editURL} text='Edit' />
                </td>
                <td>
                    {/* MAIL BUTTON */}
                    <Button href={mailTo} text='Email' />
                </td>
                <td>
                    {/* DELETE BUTTON */}
                    <Button onClick={() => deleteInvoice(invoice.id)} text='Delete' />
                </td>
            </tr>
        )
    };

    return (
        <StyleWrap>
            <h1>Invoices</h1>
            <hr />
            <div>
                <div>
                    <Button href={newURL} text='Add invoice' />
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Due Date</th>
                        <th>Name</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th colSpan={3}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.map((invoice: Invoice) => {
                        const row = getInvoiceRow(invoice, totalPerInvoice);
                        return row;
                    })}
                </tbody>
            </table>
            <div>
                <div>Grand Total</div>
                <div>
                    {total.toLocaleString("en-US")}
                </div>
            </div>
        </StyleWrap>
    )
};


export default Invoices;