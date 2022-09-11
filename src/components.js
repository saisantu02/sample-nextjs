import React from "react";
export const Field =(props)=>{
    return (
        <div style={{fontSize: 18, margin: 20}}>
            {props.label}
          <input type="text" id="first" name="first" />
        </div>
    )
}

export const Button =(props)=>{
    return (
        <div style={{fontSize: 18, margin: 20}}>
            {props.label}
            <button type="submit">Submit</button>
        </div>
    )
}