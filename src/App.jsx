import { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography } from '@mui/material';
import './App.css';
import { DozerProvider, useDozerEndpointCount, useDozerEndpoint } from "@dozerjs/dozer-react";
import { EventType } from "@dozerjs/dozer/lib/esm/generated/protos/types_pb"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

function getDateTime(timestamp) {

    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    var date = new Date(timestamp * 1000);
    // Hours part from the timestamp
    var hours = date.getHours();
    // Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
    // Seconds part from the timestamp
    var seconds = "0" + date.getSeconds();

    // Will display time in 10:30:23 format
    var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

    return formattedTime;
}

function RecordsCount(params) {
    const { count } = useDozerEndpointCount(params.endpoint, { watch: EventType.ALL })
    return (
        <Grid >
            <Paper className="dashboard-paper">
                <Typography variant="h6" gutterBottom>
                    Transactions Recorded
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
        <Grid>
            <Paper className="dashboard-paper">
                <Typography variant="h6" gutterBottom>
                    Total Traded Volume
                </Typography>
                <Typography variant="h3">{(records[0]?.traded_volume)?.toFixed(1)}</Typography>
            </Paper>
        </Grid>
    )
}

function TopBuyers() {
    let query = { orderBy: { amount_bought: "desc" }, limit: 5 }
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
                                if (field.getName() === "start" || field.getName() === "end") {
                                    val = getDateTime(val)
                                }
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
    let query = { orderBy: { amount_sold: "desc" }, limit: 5 }
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
                                if (field.getName() === "start" || field.getName() === "end") {
                                    val = getDateTime(val)
                                }
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
function AverageTransactionValue() {
    let query = { orderBy: { end: "desc" }, limit: 1 }

    const { records } = useDozerEndpoint("sum", { query, watch: EventType.ALL });

    let avg = 0;
    if (records.length > 0) {
        let record = records[0]?.averg_transaction.array;
        let scale = record[0] + 6;
        let lo = record[1];
        let mid = record[2];
        let hi = record[3];

        avg = (lo + mid * 2 ** 32 + hi * 2 ** 64) * 10 ** -scale;
    }
    console.log(records[0]?.averg_transaction);
    return (
        <Grid >
            <Paper className="dashboard-paper">
                <Typography variant="h6" gutterBottom>
                    Average Transaction Value
                </Typography>
                <Typography variant="h3">{avg.toFixed(1)}</Typography>
            </Paper>
        </Grid>
    );
}

function CountOfDistinctSellers() {
    const { count } = useDozerEndpointCount("distinct_sellers", { watch: EventType.ALL });

    return (
        <Grid >
            <Paper className="dashboard-paper">
                <Typography variant="h6" gutterBottom>
                    Unique Sellers
                </Typography>
                <Typography variant="h3">{count}</Typography>
            </Paper>
        </Grid>
    );
}

function CountOfDistinctBuyers() {
    const { count } = useDozerEndpointCount("distinct_buyers", { watch: EventType.ALL });

    return (
        <Grid >
            <Paper className="dashboard-paper">
                <Typography variant="h6" gutterBottom>
                    Unique Buyers
                </Typography>
                <Typography variant="h3">{count}</Typography>
            </Paper>
        </Grid>
    );
}

function IdentifiedSellers() {
    let query = { limit: 5 };
    const { records, fields } = useDozerEndpoint("identified_sellers", { query, watch: EventType.ALL });
    return (
        <TableContainer>
            <Table>
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
                                {fields?.map((field) => {
                                    let val = row[field.getName()];
                                    if (field.getName() === "start" || field.getName() === "end") {
                                        val = getDateTime(val);
                                    }
                                    return (
                                        <TableCell component="th" scope="row" key={field.getName()}>
                                            {val && val.toString()}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

function IdentifiedBuyers() {
    let query = { limit: 5 };
    const { records, fields } = useDozerEndpoint("identified_buyers", { query, watch: EventType.ALL });

    return (
        <TableContainer>
            <Table>
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
                                {fields?.map((field) => {
                                    let val = row[field.getName()];
                                    if (field.getName() === "start" || field.getName() === "end") {
                                        val = getDateTime(val);
                                    }
                                    return (
                                        <TableCell component="th" scope="row" key={field.getName()}>
                                            {val && val.toString()}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}


function App() {
    return (
        <DozerProvider value={{ serverAddress: "http://localhost:62998" }}>
            <Container>
                <Typography variant="h4" gutterBottom>
                    Real-Time USDT Dashboard
                </Typography>

                <Grid container spacing={3}>
                    {/* First row of components */}
                    <Grid item xs={12} md={4} lg={4}>
                        <RecordsCount endpoint="transfers" />
                    </Grid>
                    <Grid item xs={12} md={4} lg={4}>
                        <CountOfDistinctBuyers />
                    </Grid>
                    <Grid item xs={12} md={4} lg={4}>
                        <CountOfDistinctSellers />
                    </Grid>

                    {/* Second row of components */}
                    <Grid item xs={12} md={6} lg={6}>
                        <TradedVolume endpoint="sum" />
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                        <AverageTransactionValue />
                    </Grid>

                    {/* Third row of components */}
                    <Grid item xs={12} md={6} lg={6}>
                        <Paper className="dashboard-paper">
                            <Typography variant="h6" gutterBottom>
                                Top 5 Buyers
                            </Typography>
                            <TopBuyers />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                        <Paper className="dashboard-paper">
                            <Typography variant="h6" gutterBottom>
                                Top 5 Sellers
                            </Typography>
                            <TopSellers />
                        </Paper>
                    </Grid>

                    {/* Fourth row of components */}
                    <Grid item xs={12}>
                        <Paper className="dashboard-paper">
                            <Typography variant="h6" gutterBottom>
                                Identified Buyers
                            </Typography>
                            <IdentifiedBuyers />
                        </Paper>
                    </Grid>

                    {/* Fifth row of components */}
                    <Grid item xs={12}>
                        <Paper className="dashboard-paper">
                            <Typography variant="h6" gutterBottom>
                                Identified Sellers
                            </Typography>
                            <IdentifiedSellers />
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </DozerProvider>
    );
}

export default App;

