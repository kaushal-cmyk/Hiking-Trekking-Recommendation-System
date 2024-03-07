import { Field } from "formik";
import React from "react";

const FormikRadio = ({ options, name, onChange, required,label,...props }) => {
  return (
    <>
      <Field name={name}>
        {({ field, form, meta }) => {
            // console.log("field", field);
            // console.log("meta", meta);
            // console.log(options)
          return (
            <>
              <span>{label}{required?<span style={{color: "red"}}>*</span>:null}: </span>
              {options.map((option, i) => {
                return (
                  <span key={i}>
                    <label htmlFor={option.value}>{option.label}:</label>
                    <input
                    {...field}
                    {...props}
                      type="radio"
                      value={option.value}
                      id={option.value}
                      checked={meta.value === option.value}
                      onChange={
                        onChange?onChange:field.onChange
                    }
                    ></input>
                    {/* {meta.error && meta.touched?<div>{meta.error}</div>:null} */}
                  </span>
                );
              })}
            </>
          );
        }}
      </Field>
    </>
  );
};

export default FormikRadio;
