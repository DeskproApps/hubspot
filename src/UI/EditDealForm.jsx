import React from "react";
import PropTypes from "prop-types";

import Ajv from "ajv";

import {
  Formik,
  Form,
  Field,
} from "formik";

import {
  Panel,
  Button,
} from "@deskpro/apps-components";

/* OA code used for development not production */
const debug_state = true;
const DisplayFormikState = (props) => (
  <div style={{ margin: "1rem 0" }}>
    <pre
      style={{
        background: "#f6f8fa",
        fontSize: ".65rem",
        padding: ".5rem",
        fontFamily: "monospace",
      }}
    >
      <strong>props</strong> =
      {" "}{JSON.stringify(props, null, 2)}
    </pre>
  </div>);
/* OV end of code */

const ajv = new Ajv();
ajv.addFormat("number", {
  validate: /\d+(.\d+)?/,
  compare: (a, b) => {
    const left = parseFloat(a);
    const right = parseFloat(b);
    if (left > right) { return 1; }
    if (left < right) { return -1; }
    if (left === right) { return 0; }
    throw new Error("Unexpected comparison case");
  },
});

const schema = {
  $async: true,
  type: "object",
  required: ["dealname"],
  properties: {
    amount: { type: "string", format: "number" },
  },
};

const formValidation = {
  isValid: ajv.compile(schema),
};

const EditDealForm = (props) => {
  const {
    fetcher,
    cancel_f,
    submit_f,
    contact_name,
    currency,
    title,
  } = props;

  return (
    <Panel title={title}>
      <Formik
        initialValues={{
        contact: "",
        dealname: "",
        pipeline: "",
        dealstage: "",
        amount: "",
        startdate: "",
        hubspot_owner_id: "",
        company: "",
      }}
        onSubmit={submit_f}
        validationSchema={formValidation}
    >{(formik_props) => {
      const {
        // values,
        // touched,
        // errors,
        // dirty,
        isSubmitting,
        handleSubmit,
      } = formik_props;

      return (
        <Form id="dealForm" onSubmit={handleSubmit}>
          <label>
            Contact
            <Field type="select" name="contact" value={contact_name} readOnly />
          </label>
          <label>
            Deal Name
            <Field type="text" name="dealname" />
          </label>
          <label>
            Pipeline
            <Field type="text" name="pipeline" />
          </label>
          <label>
           Deal Stage
            <Field type="text" name="dealstage" />
          </label>
          <label>
            Amount ({currency})
            <Field type="text" name="amount" />
          </label>
          <label>
            Start date
            <Field type="date" name="startdate" />
          </label>
          <label>
            Owner
            <Field type="text" name="owner" />
            <Field
              type="text"
              name="hubspot_owner_id"
              value="42"
              style={{ display: "none" }}
            />
          </label>
          <label>
            Company
            <Field type="text" name="company" />
          </label>

          <div>
            <Button type="button" onClick={cancel_f}>
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
            >
              Create
            </Button>
          </div>

          {debug_state ? <DisplayFormikState {...formik_props} /> : null}
        </Form>
      );
    }}
      </Formik>
    </Panel>);
};

EditDealForm.propTypes = {
  fetcher: PropTypes.shape({}).isRequired,
  cancel_f: PropTypes.func.isRequired,
  submit_f: PropTypes.func.isRequired,
  contact_name: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export { EditDealForm };
