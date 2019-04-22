/** @jsx jsx */

import {
  Panel,
} from '@deskpro/apps-components';

import { jsx, css } from '@emotion/core';
import {
  Formik,
  Form,
  Field,
} from 'formik';
import * as yup from 'yup';

const DisplayFormikState = props =>
  <div style={{ margin: '1rem 0' }}>
    <pre
      style={{
        background: '#f6f8fa',
        fontSize: '.65rem',
        padding: '.5rem',
        fontFamily: 'monospace'
      }}
    >
      <strong>props</strong> ={' '}
      {JSON.stringify(props, null, 2)}
    </pre>
  </div>;

const CreateDealForm = (props) => {
  const form_css = css`
  label, input {
    display: block;
  }
  label {
    margin-top: 1em;
  }
  input {
    border-radius: 0.15rem;
    border-style: solid;
    border-color: #d2dce4;
    border-width: 2px;
  }
  `;

  return (
  <Panel title="Create New Deal">
    <Formik
      initialValues={{
        contact: "",
        dealname: "",
        pipeline: "",
        dealstage: "",
        amount: "",
        startdate: "",
        owner: "",
        company: "",
      }}
      onSubmit={(value, setSubmitting) => {
        setSubmitting(false);
      }}
      validationSchema={
        yup.object({
          amount: yup.number().integer("Amount must be an integer"),
        })
      }
    >{(props) => {
      const {
        // values,
        // touched,
        // errors,
        // dirty,
        isSubmitting,
        handleSubmit,
      } = props;

      return (
        <Form css={form_css} onSubmit={handleSubmit}>
          <label>
            Contact
            <Field type="select" name="contact"/>
          </label>
          <label>
            Deal Name
            <Field type="text" name="dealname"/>
          </label>
          <label>
            Pipeline
            <Field type="text" name="pipeline"/>
          </label>
          <label>
            Deal Stage
            <Field type="text" name="dealstage"/>
          </label>
          <label>
            Amount
            <Field type="text" name="amount"/>
          </label>
          <label>
            Start date
            <Field type="date" name="startdate"/>
          </label>
          <label>
            Owner
            <Field type="text" name="owner"/>
          </label>
          <label>
            Company
            <Field type="text" name="company"/>
          </label>

          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>

          <DisplayFormikState {...props} />
        </Form>
      )}
    }</Formik>
  </Panel>);
}

export { CreateDealForm };
