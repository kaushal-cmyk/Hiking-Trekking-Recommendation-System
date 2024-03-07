import { Field } from "formik";
import React from "react";

const FormikSelect = ({ options, name, label, id, onChange }) => {
  return (
    <>
      <Field name={name}>
        {({ field, meta, value }) => {
          return (
            <>
              <label htmlFor={id}>{label}</label>
              <select
              {...field}
                name={name}
                id={id}
                value={meta.value}
                onChange={onChange ? onChange : field.onChange}
              >
                {options.map((item, i) => {
                  return (
                      <option value={item.value} key={i}>{item.label}</option>
                  );
                })}
              </select>
            </>
          );
        }}
      </Field>
    </>
  );
};

export default FormikSelect;
