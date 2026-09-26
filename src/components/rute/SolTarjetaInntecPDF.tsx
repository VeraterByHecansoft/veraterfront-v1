import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    PDFDownloadLink,
    Image,
    Font,
} from "@react-pdf/renderer";

import { IDataColicitud } from "@rute/types";
import { formatearMonedaMXN } from "@/utils/Money";

// Registrar fuente Roboto (idealmente usar archivos locales)
Font.register({
    family: "Roboto",
    fonts: [
        {
            src: "/fonts/Roboto-Regular.ttf",
        },
        {
            src: "/fonts/Roboto-Bold.ttf",
            fontWeight: "bold",
        },
    ],
});

//const LOGO = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAdsAAAC/CAYAAAC2aHbMAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAABA+SURBVHgB7d1dctxUGsbxR02K4iah5zI1zHBYAWEFNCvArIBmBcAK6KwAzwrorCBhBelZQcIKLD6mchkTblJArNGx1EnbadvnlXSko9b/V9WVxFbs/pD0SEfveZUJOCC/3XaPi0wuk07fKXR894/8gQBgYJmAA/LrHXdSrtRu++9Cym8VWhG6AIY0E3DAfPC+yrT2IfzstvtSADAAwhaTQOgCGBJhi0khdAEMgbDFJBG6APpE2GLSCF0AfSBsARG6AOIibIEdhC6AGG4JmKAPXuTMMQfQG85sMTm+0YUAoEeELSbHt3IUAPSIsMX0FIQtgH4RtgAAREbYAgAQGWELAEBkhC0mx9/vVgDQI8IWAIDICFsAACIjbAEAiIywBQAgMnojY3Iyaf7bbfdYsWSaF+XvuOrbs0Kbf/6RfyUAk0HYYormZSAuFNF1dzkog9gJwKQwjAwAQGSELdC37OohZgCHibAFenbd9VwAh4mwBQAgMsIWAIDICFugZ1mhXAAmhbAFelZk+l0AJoV5tpicQspv/anPNJCX7+lUACaFsMUk3X2Z5xrKSwGYGIaRAQCIjLAFACAywhYAgMgIWwAAIiNsAQCIjLAFACAywhYAgMgIWwAAIiNsAQCIjA5SmKRn7zmnxP19S06JuPW38kG7bgEjlwk4IL/ecSflSu2EzmWF1rO/dJ/QBewYRgYQpMi0fPWuTv532/0whpEBICWELQATQhewI2wBNELoAuEIWwCt7IauAOxF2ALohA9dAdiLsAUAIDLCFgCAyAhbAAAio4MUpuhUhb696ptFoVy4YJbp6/Ka7JEANELYYnKKMmz/9Ue+FoL9csctGQYDmmP7AQAgMsIWAIDICFsAACIjbAEAiIywBQAgMsIWAIDICFsAACIjbAEAiIymFpicTJr/dtsthXOzTO+/kv5x3TLle/axADRG2GKK5mV6cO/V2pnOwxRARAwjAwAQGWELAEBkhC0OSubv6AMAiSFscVA+eJF/okJfFeI2eQDSQV0EDpavOC4yfVeu5E7oRXmwwz4F2IMNAweP0O0PYQvsx4aBySB04yNsgf3YMDA5hG48hC2wHxsGJuvZe85pAC/f0+lHp/moqqZ/uePWM+nLm5YjbIH96CCFybr7Ms81hJcCMDFM/QEAIDLCFgCAyAhbAAAiI2wBAIiMsAXQmaEqvIHUEbYAAERG2AIAEBlhCwBAZIQtAACR0UEKGAFfePT3reF6OWeFPqS5K9AcYQuMwF/vahXSmxhAmhhGBgAgMsIWAIDICFsAACIjbAEAiIywBQAgMsIWAIDICFsAACJjni0wArNCm0wqNJCzTIvy9zsBaISeMABu9Msdtw5pqvHOn/ro7ss8F4ALGEYGACAywhYAgMgIWwAAIiNsAQCIjLAFACAywhYAgMgIWwAAIiNsAQCIjLAFACAywhYAgMgIWwAAIiNsAQCIjLAFACAywhYAgMgIWwAAIiNsAdyo3FE8FYDGCFsAN/rgRX78zkwfnUkPBMCMsAUQ5O5pnv/7Rb4kdAE7whaACaEL2BG2ABohdAEA6NmzuXMnczcXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC4LCsfrnwsZLMpH7nSspDtdaxkMy8f32jcTsvHsdpZyL6+DOmpqnX1qdJ2NJM+D1nwrNr+HqgH5XP6TtU+4uCcVe/hRnb3yvflayWgqPZLcxmV/++/su8DLyjfg+Py53ysESiDLi8/759V7Qc2qvaFvZuXT+SkfBShj/JN/kGJsbwGNXv+zvIeJfo4UXurEb3eC6+9Xm+d0mPdBp+rwQ62ifJ3PU7082z9KF/eUs0sxvQ6r3jtrffhY143htgXlL9Tp+U7/63lPxXVSrpQOpYKf+Py8nFfmBrn19tyQ3uixEYo6rMkZ/gv8/qME0AD9b7gpM/taFb/+UjG4ZQsnY3dWZ5LUQ0d5cJU+bPI75VO4PqDgJWMiur5LwSgsXrb62VfMNv5pV/JZqEEdljlC/hStrPalTB59QFaL0Ox15m1WB8TOuAFRquvfcFs5+95YRxeTWCHZTorKAhavJFCwduyqA4Wm1po/EV7wNB62RfMLv3bV6rmCjfotaOZLWj9UPkDAbWsXdB18ftbbzupnKEDY1ZuR58qssthe2odTq6vHTn1zxnPCkxFYJgEp4GCqsMpNf6A93sBaOOeIru152ub+rFQoPKo4Icy+D5TjzLDDqZ8bmv1XBRVn0kPMpfrGr0+n/o9+FH9eL98HGX2oiEftn1/TqGXP/zzuvFgoJ4d4EdtNupYUX1+uTpWfk5HCjzQqbffn9W9XuZeN6iH6UOuHhXV5/2T4tvOO14aR64GGx3yFb7PjfO2FurPkeG5naibMwjTPNuOfmeKVob3YKX+3bOsuxqgorc8E10HrreW+ZxPNCKZYY6m0qu6Ns2z1YEawWdoyjFFNrvi675Y6j8yyKpJwn1NtLec1a7EVJ8peWpdd3t2FHL5o56itjG8Fj8MRrEU8Eae0r5gds33rMVSTv1s7EvZpvo8EKZmrUQFHijmejMq4P8MGubOKJYCLsuViOvC1lwsldk74ZhltgYWFEUhGaFFUZeu554ajs4plgISNbvh+xvZii6iTgWyVHDWRRWPBKTBFWG9eHO9PRoTPMqUYCtVALo5bLeVdMHVmhE39tCd1dZ9AYmo54S7m5a7okrZNMqUcXYLJOfGsFWzYqnOz25Dd1Ze3QkrF5CGe4FFUX4qylU1BhuFjzL5YqmVACQjJGy9lWzhtVC3xVKWBha5Ei6QwfSUB58PAxe9tsagMIzW9FE/ASBcaNiqQbFUZ5WRM3v/41yYspQqcpcKGz5e6+Yz100RXl0/ZzgZSMctw7IbVQVHR4HLnxdLnbWvCLae1aYy1cef2cfoTHSs9DpTpcYpDZbbP4aeta7Kx+cKO6Dw2+pCETpLIdysgxu173OWZmeqpJTv/WKsXUWadJZyasHYpcQpHlMHqVgPDR8kqXeQ8md0J4bnuFAkgZ2i/HOw7oyDP4Os6kSVnGxCHaQi7gsGNYLPMKlOX5YzW+/8NnyZYXgqa9c3eanAD2mI/sdIxrYf6ufZcDfGuMwyInNfNn50w1+TDTm7daoOelYChhO90f8Of2Lkt72Fxq58IU+MRwwLNWA8Q3GKizPbyiqTikN5xHo/Q9ddNR9i/MbwOp8rsWKpjDPbLtbdQVk+wxE8niuy4AKpXdbOTFmzvslLMdUH8eXq3lJh626u5vPB/dntJnBZiqWAaxQ93AGqUdjKVhXpOdmmAlkKS3IxRIYGijiFQ8Hrbr0N5WqosAX1tlgKwNui3/6vadh6pmrbLPwak39SfrzdhSxbELRobq2OzcLnt+Zqv+5uZDhgyHq8MxcwMseKrE3YnhqPrEObpIfeWPumjjvAleqz2q7XHb/uBo3gdHWQaJz/7sRt+IAL+roMaa1GvswfDfg5f4uQhevexn4Ht7lqGd/AwnDl/wslqt7p/q7uMce2PX+QZgmpIIbrorm6C/rzdqr1yNGN/HJU7verxWwMRFYH7Uo9aBu2qqcCLUKX99ezrrlWFjxdYgQ7jB/FDi0129vVxWgMslRgw5dyG3hUdHv9dKPAsFVVLPUDAdCrjZCUOoN80G7Uk9Zhq6pYKvjIWm/6Jr81Rm44q83FXX3GwIdb6I3Pnewu//z80ve3//Znsj/Vf0YZGchs91n203aGHM5diM5S6FFRdR8M2fb8wWBol8JdPofyPV//fef35vXfNxrxCKF/gyydpfycpsuFGsFz1zTMjso0z1aJzWvsUKwOUpZ5o9vHifqdLL+Xb0va4LkP/fDv3WDFUtmE5tnqQEX8DJcN12fL7+hdmwKpXeZiKV0KzCx8cn+uHirH0Ltj672TVR0APdGwZ4nBBX2JcaJYCmlal9vUJ7LvCx7PItzetStdha1nmWS/HXZz9T+XYqoPqo3sMxmvdZfr0vezgZo2zEa8Pmbchg/peloHbm75Tz4f6n1BclPcugxb6yT712ezWXgTgLWY6nPonjYJ3Po6qD/LderPsgjvf5yieRbpjjRAB/IR7Qtu1GnYqi6WMiy/qG8/5QKXN4U5RqvRRla654eS1NN13CzhISuDhegshXQ13Re4el/QpNgqiq7D1lvJMNZez70NWc6HeC5MxXYjs/YsPb+OG/vazeziZZBRy+gshbTl9ZDyRjZ+X/Awleu4McL2tGh/w/jLclEUNUXbwH0ko51rNzEEd4oaCae0X48Tps7nymdZg8uI9b5g8APKGGHrrdXhHL66KCoXpshvZF8YL0+cq6/dnKjjnXVdFBW04foj8vKRDfD4SPbe5U5Aws6qOgnz5cSimk406HXcLppa7OWncdQ7urZyjbMoyrexjNGusa2Nxnng8o1vYNHgOun5tZuiau1pHZLe556xy1kXv7OJbRvH0PeLzlLxrJSAWXWA+P7232fjvTXpefOjFvsCP/JqHi1LXesbjSud4o0kbh7fwfu5VDuxmlp0/vsvP7q4dpMF3hS+fv1Ow7I2m/HPuZeCkszWEGGptCRx8/gO9gULtZAN35jkm6avfYjruLGGkbf8ddZcDRUdD0fjIKyKhjcR6GAO3lLh88Hva/izBnP9RJboHEVgj+N6xMrcerGoDtofqsd1PXbYti2Wui/gbU06zJxrMQcv+KbwSqugby3bAasTnaUQJoX+wo8aTg3yjrIer+PGDlvPj41vZJTImQHS1ajDTG07B28R+h/qoigXsmxhnP4WW2FvNnMw05oQT5FOTcrTFoG7bfka/fJJH2GrBj1vczHVBzfLW25kob1UXRHeKSpXegV9GxkLQjI6S2Fc2uwLfG3Dwx7m5vfivDIydOHUzgyQtDYbWdB13PosOPTnNbqeHFt9OceyTS2UUPcdIMC2+UWjGQA713GdIugrbL3QYim/TGpnBkhb243suuu4S4UPH6+VbkGf6YDXo1gKI+TrhD7JmmfIUX1w7QKXn9dnxGtVo0H+cTzbM2892jzbPU7rubfXniUwzw8NnW9ks6p4KnTId9e+OXiWoigv9YI+f8DrdwKhAepUFUutBIzIWXWQnKv5jUL8Ga7fF2yuWuCd8me/KvPqbE/TpfJrztd5nFXb3PlJQKb+La75nh/mGqoJwE38Dupe4LKnSncYvO1zmyt8Zz3U++DUTt7wZ+UCMAU+C/xllpXengeeqw7pMnCPz1pOgQUAYJJ2R2jrRhnPVXVMPKmbZmwLDOf1dWAAAGCw0M7wdN0ha7Xz/XX9tS3/vXt9XrMFAGDsFro0NbU8k/3wrPq6P5P9VBcvh/oakNBLkAAAQFXl8WvbYeTsTR/yy9XM/u+rPqf+AAAwdr7o80KRqJ9Wt9PRzuliYahf9pSwBQAgnB8W3tfwJa9vjOAudWBbiBvqAABg9jpM9xRIrXZuKzgXrU8BAGhkEdhL2RdSOQEAgEaWs6vD1NXza19XIQ/RQQoAgEPgVFUa+2Hj81sOln/5sHz8pCqIuaEOAAAduraV7f8BfKE8p21e6uEAAAAASUVORK5CYII=`

// Página
const SolPagePage: React.FC<{ data: IDataColicitud }> = ({ data }) => {
    const importe = Number(data?.importe ?? 0);
    const iva = Number(data?.iva ?? 0);
    const total = Number(data?.TOTAL ?? 0);

    return (
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                {/* <Image style={styles.logo} src={LOGO} /> */}
                <Text style={styles.title}>Voucher de pago - Solicitud de tarjetas</Text>

                <Text style={styles.subtitle}>
                    Generado el:{" "}
                    {new Date().toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </Text>
            </View>

            {/* Datos del cliente */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>DATOS DEL CLIENTE</Text>

                <Text style={styles.sectionText}>Cliente: {data?.idCliente}</Text>
                <Text style={styles.sectionText}>Folio INNTEC: {data?.FolioInntec}</Text>
            </View>

            {/* Detalle */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>DETALLE</Text>

                <View style={styles.table}>
                    {/* Cabecera */}
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={styles.tableCellHeader}>Cantidad tarjetas</Text>
                        <Text style={styles.tableCellHeader}>Importe</Text>
                        <Text style={styles.tableCellHeader}>IVA</Text>
                        <Text style={styles.tableCellHeader}>Total</Text>
                        <Text style={styles.tableCellHeader}>Cuenta depósito</Text>
                    </View>

                    {/* Fila */}
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCell}>{data?.cantTjs}</Text>
                        <Text style={styles.tableCell}>{formatearMonedaMXN(importe)}</Text>
                        <Text style={styles.tableCell}>{formatearMonedaMXN(iva)}</Text>
                        <Text style={styles.tableCell}>{formatearMonedaMXN(total)}</Text>
                        <Text style={styles.tableCell}>{data?.CLABEtj}</Text>
                    </View>
                </View>
            </View>

            {/* Nota */}
            <View style={styles.footer}>
                <Text>
                    Realiza el pago a la cuenta indicada con el monto total. En concepto coloca
                    el Folio INNTEC: {data?.FolioInntec}
                </Text>
                <Text style={{ marginTop: 5 }}>
                    Te recomendamos verificar Saldos y Movimientos de tu cuenta.
                </Text>
            </View>

            {/* Número de página */}
            <Text style={styles.pageNumber}>Página 1 de 1</Text>
        </Page>
    );
};

// Documento principal
const ComprobanteStatement: React.FC<{ data: IDataColicitud }> = ({ data }) => (
    <Document>
        <SolPagePage data={data} />
    </Document>
);

// Botón de descarga
export const SolTarjetaInntecPDF: React.FC<{ data: IDataColicitud }> = ({ data }) => {
    return (
        <PDFDownloadLink
            document={<ComprobanteStatement data={data} />}
            fileName={`voucher_tarjetas_${data.cod}.pdf`}
        >
            {({ loading }) => (
                <button
                    disabled={loading}
                    className="inline-flex items-center justify-center whitespace-nowrap font-medium btn btn-light text-xs btn-sm h-8 rounded-md px-3 gap-1"
                >
                    {loading ? "Generando PDF..." : "Descargar PDF"}
                </button>
            )}
        </PDFDownloadLink>
    );
};

// Estilos
const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontFamily: "Roboto",
        position: "relative",
    },
    header: {
        textAlign: "center",
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#E40E20",
    },
    logo: { width: 100, alignSelf: "center", marginBottom: 5 },
    title: { fontSize: 18, fontWeight: "bold" },
    subtitle: { fontSize: 10, color: "#7f8c8d" },

    section: { marginTop: 15 },
    sectionTitle: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#E40E20",
        borderBottomWidth: 1,
        borderBottomColor: "#E40E20",
        marginBottom: 5,
    },
    sectionText: { fontSize: 12, marginBottom: 2 },

    table: {
        borderWidth: 1,
        borderColor: "#cccccc",
        marginTop: 5,
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#cccccc",
        padding: 4,
        alignItems: "center",
    },
    tableHeader: {
        backgroundColor: "#E40E20",
    },
    tableCellHeader: {
        flex: 1,
        fontSize: 9,
        fontWeight: "bold",
        color: "#fff",
        paddingHorizontal: 2,
    },
    tableCell: {
        flex: 1,
        fontSize: 9,
        paddingHorizontal: 2,
    },

    footer: {
        marginTop: 20,
        fontSize: 10,
        borderTopWidth: 1,
        borderTopColor: "#E40E20",
        paddingTop: 10,
    },

    pageNumber: {
        position: "absolute",
        bottom: 10,
        right: 20,
        fontSize: 10,
        color: "gray",
    },
});
