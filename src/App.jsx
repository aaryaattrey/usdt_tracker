//import React from 'react';
import { Container, Grid, Paper, Typography } from '@mui/material';
import './App.css';
import { DozerProvider, useDozerEndpointCount, useDozerEndpoint } from "@dozerjs/dozer-react";
import { EventType } from "@dozerjs/dozer/lib/esm/generated/protos/types_pb"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';



function RecordsCount(params) {
    const { count } = useDozerEndpointCount(params.endpoint, { watch: EventType.ALL })
    return (
        <Grid item xs={6}>
            <Paper className="dashboard-paper">
                <Typography variant="h6" gutterBottom>
                    Records Count
                </Typography>
                <Typography variant="h3">{count}</Typography>
            </Paper>
        </Grid>

    )
}
function TradedVolume(params) {
    let query = { orderBy: { end: "desc" }, limit: 1 }
    const { records } = useDozerEndpoint(params.endpoint, { query, watch: EventType.ALL })
    return (
        <Grid item xs={6}>
            <Paper className="dashboard-paper">
                <Typography variant="h6" gutterBottom>
                    Total Traded Volume
                </Typography>
                <Typography variant="h3">{(records[0]?.traded_volume)}</Typography>
            </Paper>
        </Grid>
    )
}

function TopBuyers() {
    let query = { orderBy: { end: "desc" }, limit: 5 }
    const { records, fields } = useDozerEndpoint("buyers", { query, watch: EventType.ALL })
    return (<TableContainer >
        <Table >
            <TableHead>
                <TableRow>
                    {fields?.map((field, idx) => (
                        <TableCell key={idx}>{field.getName()}</TableCell>
                    ))}

                </TableRow>
            </TableHead>
            <TableBody>
                {records.map((row, idx) => {
                    return (
                        <TableRow key={idx}>
                            {fields?.map(field => {
                                let val = row[field.getName()]
                                return (<TableCell component="th" scope="row" key={field.getName()}>
                                    {val && val.toString()}
                                </TableCell>)
                            })}
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    </TableContainer>
    )

}

function TopSellers() {
    let query = { orderBy: { end: "desc" }, limit: 5 }
    const { records, fields } = useDozerEndpoint("sellers", { query, watch: EventType.ALL })
    return (<TableContainer >
        <Table >
            <TableHead>
                <TableRow>
                    {fields?.map((field, idx) => (
                        <TableCell key={idx}>{field.getName()}</TableCell>
                    ))}
                    {/* <TableCell>Address</TableCell>
                    <TableCell>Amount Sold</TableCell> */}
                </TableRow>
            </TableHead>
            <TableBody>
                {records.map((row, idx) => {
                    return (
                        <TableRow key={idx}>
                            {fields?.map(field => {
                                let val = row[field.getName()]
                                return (<TableCell component="th" scope="row" key={field.getName()}>
                                    {val && val.toString()}
                                </TableCell>)
                            })}
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    </TableContainer>
    )

}

function App() {

    return (
        <DozerProvider value={{ "serverAddress": "http://localhost:62998" }}>
            <Container>
                <Typography variant="h4" gutterBottom>
                    Real-Time USDT Dashboard
                </Typography>

                <Grid container spacing={3}>
                    <RecordsCount endpoint="transfers" />
                    <TradedVolume endpoint="sum" />
                </Grid>

                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <Paper className="dashboard-paper">
                            <Typography variant="h6" gutterBottom>
                                Top 5 Buyers
                            </Typography>
                            <TopBuyers />
                        </Paper>
                    </Grid>

                    <Grid item xs={6}>
                        <Paper className="dashboard-paper">
                            <Typography variant="h6" gutterBottom>
                                Top 5 Sellers
                            </Typography>
                            <TopSellers />
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </DozerProvider>

    );
}

export default App;
