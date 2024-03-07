import { Field } from 'formik'
import React from 'react'

const FormikTextArea = ({name, id, onChange, label,required,...props}) => {
  return (
    <>
        <Field name={name}>
            {({field, form, meta}) => {
                return <>
                    <label htmlFor={id}>{label}{required?<span>*</span>:null}</label>
                    <textarea
                        id={id}
                        onChange={onChange?onChange: field.onChange}
                        value={meta.value}
                        {...field}
                        {...props}
                    ></textarea>
                    {meta.touched && meta.error?<div>{meta.error}</div>: null}
                </>
            }}

        </Field>
    </>
  )
}

export default FormikTextArea