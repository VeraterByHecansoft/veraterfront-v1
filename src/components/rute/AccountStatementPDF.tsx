import React, { useMemo } from 'react';
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    PDFDownloadLink,
    Image,
    Font
} from '@react-pdf/renderer';

import { IDataMovStp } from '@rute/types';
import { formatearMonedaMXN } from '@/utils/Money';
import { STATUSTRANS, TIPOSTRANS } from '@/utils/Cosnts';


export interface ClientInfo {
    name: string;
    accountNumber: string;
    period: string;
    initialBalance: number;
}

export interface AccountStatementPDFProps {
    clientInfo: ClientInfo;
    transactions: IDataMovStp[];
}

export interface PageContent {
    transactions: IDataMovStp[];
    pageNumber: number;
    totalPages: number;
}

// Constantes de diseño
const PAGE_PADDING = 20;
const HEADER_HEIGHT = 100;
const FOOTER_HEIGHT = 50;
const ROW_HEIGHT = 25;
const TABLE_HEADER_HEIGHT = 25;

const LOGO = `data:image/png;base64,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`

// Calcular filas por página basado en el tamaño de la página
const getRowsPerPage = (pageHeight: number) => {
    const availableHeight = pageHeight - PAGE_PADDING * 2 - HEADER_HEIGHT - FOOTER_HEIGHT;
    return Math.floor((availableHeight - TABLE_HEADER_HEIGHT) / ROW_HEIGHT);
};

// Registrar fuentes
Font.register({
    family: 'Roboto',
    fonts: [
        { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2' },
        { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmEU9fBBc4AMP6lQ.woff2', fontWeight: 700 },
    ],
});

// Función para dividir transacciones en páginas
const paginateTransactions = (
    transactions: IDataMovStp[],
    pageHeight: number,
): PageContent[] => {
    const rowsPerPage = getRowsPerPage(pageHeight);
    const pages: PageContent[] = [];
    let currentPageTransactions: IDataMovStp[] = [];

    for (let i = 0; i < transactions.length; i++) {
        currentPageTransactions.push(transactions[i]);
        if (currentPageTransactions.length >= rowsPerPage || i === transactions.length - 1) {
            pages.push({
                transactions: [...currentPageTransactions],
                pageNumber: pages.length + 1,
                totalPages: Math.ceil(transactions.length / rowsPerPage)
            });
            currentPageTransactions = [];
        }
    }

    // Si no hay transacciones, crear una página vacía
    if (pages.length === 0) {
        pages.push({
            transactions: [],
            pageNumber: 1,
            totalPages: 1
        });
    }

    return pages;
};

// Componente para una página individual
const AccountStatementPage: React.FC<{
    clientInfo: ClientInfo;
    pageContent: PageContent;
    showHeader?: boolean;
    showSummary?: boolean;
    balance?: {
        saldo: number,
        totalEgresos: number
        totalIngresos: number
    }
}> = ({
    clientInfo,
    pageContent,
    showHeader = true,
    showSummary = false,
    balance,
}) => {
        return (
            <Page size="A4" style={styles.page}>
                {/* Cabecera */}
                {showHeader && (
                    <View style={styles.header}>
                        <Image style={styles.logo} src={LOGO} />
                        <Text style={styles.title}>ESTADO DE CUENTA</Text>
                        <Text style={styles.subtitle}>
                            Generado el: {new Date().toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </Text>
                    </View>
                )}

                {/* Información del cliente (solo en la primera página) */}
                {showHeader && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}></Text>
                        <Text style={styles.sectionText}>Nombre: {clientInfo.name}</Text>
                        <Text style={styles.sectionText}>Número de cuenta: {clientInfo.accountNumber}</Text>
                        <Text style={styles.sectionText}>Período: {clientInfo.period}</Text>
                        <Text style={styles.sectionText}>Saldo Actual: ${clientInfo?.initialBalance && clientInfo.initialBalance.toFixed(2)}</Text>
                    </View>
                )}

                {/* Movimientos */}
                <View style={styles.section}>
                    {showHeader && <Text style={styles.sectionTitle}>DETALLE DE TRANSACCIONES</Text>}
                    <View style={styles.table}>
                        {/* Encabezados (solo en la primera página de cada grupo) */}
                        {showHeader && (
                            <View style={[styles.tableRow, styles.tableHeader]}>
                                <Text style={styles.tableCell}>Fecha/Hora</Text>
                                <Text style={styles.tableCell}>Referencia</Text>
                                <Text style={styles.tableCell}>Descripción</Text>
                                <Text style={styles.tableCell}>Tipo</Text>
                                <Text style={styles.tableCell}>Estatus</Text>
                                <Text style={styles.tableCell}>Importe</Text>
                                <Text style={styles.tableCell}>Saldo</Text>
                            </View>
                        )}

                        {/* Transacciones */}
                        {pageContent.transactions.map((transaction, index) => (
                            <View key={transaction.CVERast} style={index / 2 ? styles.tableRow2 : styles.tableRow}>
                                <Text style={styles.tableCell}>
                                    {new Date(transaction.fechCrea).toLocaleDateString('es-ES')}
                                    {"\n"}
                                    {transaction.time}
                                </Text>
                                <Text style={styles.tableCell}>{transaction.referencia}</Text>
                                <Text style={styles.tableCell}>{transaction.concepto}</Text>
                                <Text style={styles.tableCell}>
                                    {transaction.tipo && TIPOSTRANS[transaction.tipo]}
                                </Text>
                                <Text style={styles.tableCell}>
                                    {transaction.estatus && STATUSTRANS[transaction.estatus]}
                                </Text>
                                <Text style={styles.tableCell}>
                                    ${transaction.importe && transaction.importe.toFixed(2)}
                                </Text>
                                <Text style={styles.tableCell}>
                                    ${transaction.saldo && transaction.saldo.toFixed(2)}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Resumen (solo en la última página) */}
                {showSummary && (
                    <View style={styles.summary}>
                        <View style={styles.summaryItem}>
                            <Text>Total Ingresos</Text>
                            <Text style={styles.summaryValue}>
                                {balance && formatearMonedaMXN(balance.totalIngresos)}
                            </Text>
                        </View>
                        <View style={styles.summaryItem}>
                            <Text>Total Egresos</Text>
                            <Text style={styles.summaryValue}>
                                {balance && formatearMonedaMXN(balance.totalEgresos)}
                            </Text>
                        </View>
                        <View style={styles.summaryItem}>
                            <Text>Saldo Final</Text>
                            <Text style={styles.summaryValue}>{balance && formatearMonedaMXN(balance.saldo)}</Text>
                        </View>
                    </View>
                )}

                {/* Pie de página */}
                <View style={styles.footer}>
                    <Text>Este documento es generado automáticamente - Términos y condiciones aplican</Text>
                </View>

                {/* Número de página */}
                <Text style={styles.pageNumber}>
                    Página {pageContent.pageNumber} de {pageContent.totalPages}
                </Text>
            </Page>
        );
    };


// Componente principal del documento
const AccountStatement: React.FC<AccountStatementPDFProps> = ({
    clientInfo,
    transactions
}) => {
    // Calcular transacciones con saldo
    const transactionsWithBalance = useMemo(() => {
        const sorted = [...transactions].sort((a, b) =>
            new Date(b.fechCrea).getTime() - new Date(a.fechCrea).getTime()
        );
        return sorted;
    }, [transactions]);

    // Paginar transacciones
    const pages = useMemo(() => {
        const PAGE_HEIGHT = 760; // 830 Altura de página A4 en puntos (29.7cm)
        return paginateTransactions(transactionsWithBalance, PAGE_HEIGHT);
    }, [transactionsWithBalance, clientInfo]);
    const totalEgresos = transactions
        .filter(t => t.tipo === 'EGRE' && t.estatus === 'LQ')
        .reduce((sum, t) => sum + t.importe, 0)
    const totalIngresos = transactions
        .filter(t => t.tipo === 'INGR' && t.estatus === 'LQ')
        .reduce((sum, t) => sum + t.importe, 0)
    const balance = {
        saldo: clientInfo.initialBalance,
        totalEgresos,
        totalIngresos
    }
    return (
        <Document>
            {pages.map((pageContent, index) => (
                <AccountStatementPage
                    key={index}
                    clientInfo={clientInfo}
                    pageContent={pageContent}
                    showHeader={index === 0}
                    showSummary={index === pages.length - 1}
                    balance={balance}
                />
            ))}
        </Document>
    );
};

// Componente de descarga
export const AccountStatementPDF: React.FC<AccountStatementPDFProps> = ({
    clientInfo,
    transactions
}) => (
    <PDFDownloadLink
        document={<AccountStatement clientInfo={clientInfo} transactions={transactions} />}
        fileName={`estado_cuenta_${clientInfo.accountNumber}.pdf`}
    >
        {({ loading }) => (
            <button disabled={loading}
                className={`inline-flex items-center justify-center whitespace-nowrap font-medium ring-0 focus:ring-0 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 btn btn-light text-xs btn-sm h-8 rounded-md px-3 gap-1`}>
                {loading ? 'Generando PDF...' : 'Descargar Estado de Cuenta'}
            </button>
        )}
    </PDFDownloadLink>
);

// Estilos
const styles = StyleSheet.create({
    document: {
        fontFamily: 'Roboto',
    },
    page: {
        padding: PAGE_PADDING,
        position: 'relative',
    },
    header: {
        marginBottom: 15,
        paddingBottom: 10,
        borderBottom: '1 solid #E40E20',
    },
    logo: {
        textAlign: 'center',
        width: 100
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2c3e50',
        textAlign: 'center',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 10,
        color: '#7f8c8d',
        textAlign: 'center',
    },
    section: {
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#3498db',
        borderBottom: '1 solid #E40E20',
        paddingBottom: 2,
    },
    sectionText: {
        fontSize: 14,
    },
    table: {
        display: "flex",
        width: "100%",
        border: "1 solid #e0e0e0",
        fontSize: 8,
    },
    tableRow: {
        flexDirection: "row",
        borderBottom: "1 solid #e0e0e0",
        minHeight: ROW_HEIGHT,
    },
    tableRow2: {
        flexDirection: "row",
        borderBottom: "1 solid #a8a6a6ff",
        minHeight: ROW_HEIGHT,
    },
    tableHeader: {
        backgroundColor: '#E40E20',
        color: '#fff',
        fontWeight: 'bold',
        minHeight: TABLE_HEADER_HEIGHT,
    },
    tableCell: {
        padding: 4,
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    footer: {
        position: 'absolute',
        bottom: PAGE_PADDING,
        left: PAGE_PADDING,
        right: PAGE_PADDING,
        textAlign: 'center',
        fontSize: 8,
        color: '#7f8c8d',
        borderTop: '1 solid #e0e0e0',
        paddingTop: 5,
    },
    summary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        padding: 5,
        backgroundColor: '#f8f9fa',
        border: '1 solid #e0e0e0',
        borderRadius: 2,
        fontSize: 9,
    },
    summaryItem: {
        flex: 1,
        textAlign: 'center',
    },
    summaryValue: {
        fontWeight: 'bold',
        marginTop: 2,
    },
    pageNumber: {
        position: 'absolute',
        bottom: PAGE_PADDING,
        right: PAGE_PADDING,
        fontSize: 10,
        color: '#7f8c8d',
    }
});