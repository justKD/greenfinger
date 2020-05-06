import * as React from "react";
import { render } from "react-dom";

import "./data/aws-s3";

import App from "./App";

// import { data } from "./data";

// data.pullRecords().then(() => {
//   console.log(data.records);
// });

const rootElement = document.getElementById("root");
render(<App />, rootElement);
