
import { DozerProvider, useDozerEndpointCount } from "@dozerjs/dozer-react";
import { Card, Typography } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useDozerEndpoint } from "@dozerjs/dozer-react"
import { EventType } from "@dozerjs/dozer/lib/esm/generated/protos/types_pb"

function DataTable(params) {
  let query = { limit: 5 };
  const { fields, records } = useDozerEndpoint(params.endpoint, { query, watch: EventType.ALL })
  return (
    <>

      <TableContainer component={Card} sx={{ my: 5, padding: 5, width: '30%', bgcolor: "mediumslateblue" }}>
        <Table sx={{ minWidth: 650 }} aria-label="dozer table">
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
      <Typography sx={{ bgcolor: "#a73d82" }}>Transfers</Typography>
    </>
  )
}


function RecordsCount(params) {
  const { count } = useDozerEndpointCount(params.endpoint, { watch: EventType.ALL })
  return (
    <Card variant="outlined" sx={{ width: 200, px: 2, py: 2, mx: 3, my: 5, bgcolor: "#a73d82", boxShadow: 5 }}>
      <div>
        <h2>Records Count: {count}</h2>
      </div>
    </Card >

  )
}

function TradedVolume(params) {
  let query = { orderBy: { end: "desc" }, limit: 1 }
  const { records } = useDozerEndpoint(params.endpoint, { query, watch: EventType.ALL })
  return (
    <Card variant="outlined" sx={{ width: 200, px: 2, py: 2, mx: 0, my: 5, bgcolor: "#a73d82" }}>
      <div>
        <h2>Traded Volume: {(records[0]?.traded_volume)} USDT</h2>
      </div>
    </Card >
  )
}

export default function App() {

  return (

    <>
      <header><div style={{ padding: 10, backgroundColor: "#a73d82", textAlign: "center" }} >
        USDT Tracker
      </div ></header>

      <body>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
          <DozerProvider value={{ "serverAddress": "http://localhost:62998" }}>
            <DataTable
              endpoint={"transfers"} />
            <RecordsCount endpoint={"transfers"} />
            <TradedVolume endpoint={"sum"} />

          </DozerProvider>
        </div>
      </body>


    </>
  );
}



// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App
