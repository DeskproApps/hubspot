/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import PropTypes from "prop-types";

import {
  Formik,
  Form,
  Field,
} from "formik";
import * as yup from "yup";

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
      <strong>props</strong> ={" "}
      {JSON.stringify(props, null, 2)}
    </pre>
  </div>);
/* OV end of code */

const CreateDealForm = (props) => {
  const {
    cancel_f,
    submit_f,
    owner_id,
  } = props;

  const form_css = css`
  label, input {
    display: block;
  }
  > * {
    margin-top: 1em;
  }
  input {
    border-radius: 0.25rem;
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
        hubspot_owner_id: "",
        company: "",
      }}
        onSubmit={submit_f}
        validationSchema={
        yup.object({
          amount: yup.number(),
        })
      }
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
        <Form css={form_css} onSubmit={handleSubmit}>
          <label>
          Contact
          <Field type="select" name="contact" value={props.name} readOnly />
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
          Amount
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
              value={owner_id}
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
              css={{
            position: "relative",
            float: "right",
          }}>
            Create
            </Button>
          </div>

          {debug_state ? <DisplayFormikState {...formik_props} /> : null}
        </Form>
      );
 }
    }
      </Formik>
    </Panel>);
};

CreateDealForm.propTypes = {
  cancel_f: PropTypes.func.isRequired,
  submit_f: PropTypes.func.isRequired,
  owner_id: PropTypes.string.isRequired,
};

export { CreateDealForm };
