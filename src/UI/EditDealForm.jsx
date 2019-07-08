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
const debugState = true;
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
    cancelF,
    submitF,
    contactName,
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
        hubspotOwnerId: "",
        company: "",
      }}
        onSubmit={submitF}
        validationSchema={formValidation}
    >{(formikProps) => {
      const {
        // values,
        // touched,
        // errors,
        // dirty,
        isSubmitting,
        handleSubmit,
      } = formikProps;

      return (
        <Form id="dealForm" onSubmit={handleSubmit}>
          <label>
            Contact
            <Field type="select" name="contact" value={contactName} readOnly />
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
              name="hubspotOwnerId"
              value="42"
              style={{ display: "none" }}
            />
          </label>
          <label>
            Company
            <Field type="text" name="company" />
          </label>

          <div>
            <Button type="button" onClick={cancelF}>
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
            >
              Create
            </Button>
          </div>

          {debugState ? <DisplayFormikState {...formikProps} /> : null}
        </Form>
      );
    }}
      </Formik>
    </Panel>);
};

EditDealForm.propTypes = {
  cancelF: PropTypes.func.isRequired,
  submitF: PropTypes.func.isRequired,
  contactName: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export { EditDealForm };
