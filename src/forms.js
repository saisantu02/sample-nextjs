import React from "react";
import { Field } from "./components";
const Forms = () => {
  return (
    <>
      <div style={{marginLeft: "45%" }}>
        <form action="/learn" method="post">
          <Field label="First Name: " />
          <Field label="Last Name: " />
          <Field label="Email: " />
          <Field label="Mobile Number: " />
          <div style={{paddingLeft: 20 }}>
          <button  type="submit">Submit</button>
          </div>
        </form>
      </div>
    </>
  );
};
export default Forms;
