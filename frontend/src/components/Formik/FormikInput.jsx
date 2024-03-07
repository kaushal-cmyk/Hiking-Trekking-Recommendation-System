import { Field } from "formik";
import React from "react";

const FormikInput = ({
  label,
  id,
  type,
  name,
  onChange,
  required,
  ...props
}) => {
  return (
    <>
      <Field name={name}>
        {({ field, form, meta }) => {
          // console.log(meta);
          return (
            <>
              <label htmlFor={id}>
                {label}
                {required ? (
                  <span style={{ color: "red" }}>*</span>
                ) : null}:{" "}
              </label>
              <input
                {...field}
                {...props}
                type={type}
                id={id}
                value={meta.value}
                onChange={onChange ? onChange : field.onChange}
              ></input>
              {meta.touched && meta.error ? (
                <div style={{ color: "red" }}>{meta.error}</div>
              ) : null}
            </>
          );
        }}
      </Field>
    </>
  );
};

export default FormikInput;
