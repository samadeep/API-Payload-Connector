import React, { useState } from "react";
import Ajv from "ajv";

const ajv = new Ajv(); // Create an AJV instance

// Define the JSON schema as above
const schema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "DefaultPayloadSchema",
  type: "object",
  properties: {
    clientId: { type: "string" },
    externalId: { type: "string" },
    invoiceDescription: { type: "string" },
    services: {
      type: "array",
      items: {
        type: "object",
        properties: {
          type: { type: "string" },
          description: { type: "string" },
        },
        required: ["type", "description"],
        additionalProperties: false,
      },
    },
    groupDescription: { type: "string" },
    groupType: { type: "string" },
    invoiceDate: { type: "string" },
    someNumber: { type: "number" },
    nested: {
      type: "object",
      properties: {
        nestedKey: { type: "string" },
        deep: { type: "string" },
      },
      required: ["nestedKey", "deep"],
      additionalProperties: false,
    },
    commonConfigurations: {
      type: "object",
      properties: {
        configName: { type: "string" },
        schemaDefinition: {
          type: "object",
          properties: {
            SCHEMA_PAYLOAD_1: {
              type: "object",
              properties: {
                type: { type: "string" },
                expression: { type: "string" },
              },
              required: ["type", "expression"],
              additionalProperties: false,
            },
            SCHEMA_PAYLOAD_2: {
              type: "object",
              properties: {
                type: { type: "string" },
                expression: { type: "string" },
              },
              required: ["type", "expression"],
              additionalProperties: false,
            },
          },
          required: ["SCHEMA_PAYLOAD_1", "SCHEMA_PAYLOAD_2"],
          additionalProperties: false,
        },
        configuration: {
          type: "object",
          properties: {
            billing: { type: "string" },
            loadParam: { type: "string" },
            customerId: { type: "string" },
          },
          required: ["billing", "loadParam", "customerId"],
          additionalProperties: false,
        },
      },
      required: ["configName", "schemaDefinition", "configuration"],
      additionalProperties: false,
    },
  },
  required: [
    "clientId",
    "externalId",
    "invoiceDescription",
    "services",
    "groupDescription",
    "groupType",
    "invoiceDate",
    "someNumber",
    "nested",
    "commonConfigurations",
  ],
  additionalProperties: false,
};

// Your default payload instance
const defaultPayload = {
  clientId: "",
  externalId: "",
  invoiceDescription: "",
  services: [
    {
      type: "",
      description: "",
    },
  ],
  groupDescription: "",
  groupType: "",
  invoiceDate: "",
  someNumber: 0,
  nested: {
    nestedKey: "",
    deep: "",
  },
  commonConfigurations: {
    configName: "",
    schemaDefinition: {
      SCHEMA_PAYLOAD_1: {
        type: "",
        expression: "",
      },
      SCHEMA_PAYLOAD_2: {
        type: "",
        expression: "",
      },
    },
    configuration: {
      billing: "",
      loadParam: "",
      customerId: "",
    },
  },
};

// Compile the schema into a validation function
const validate = ajv.compile(schema);

function JsonValidatorComponent() {
  const [result, setResult] = useState("");

  const handleValidation = () => {
    const valid = validate(defaultPayload);
    if (valid) {
      setResult("Default payload is valid.");
    } else {
      // ajv.errorsText produces a concise string of errors
      setResult(
        "Default payload is invalid: " + ajv.errorsText(validate.errors)
      );
    }
  };

  return (
    <div>
      <h2>Validate Default Payload</h2>
      <button onClick={handleValidation}>Validate Payload</button>
      <p>{result}</p>
      <h3>Default Payload</h3>
      <pre>{JSON.stringify(defaultPayload, null, 2)}</pre>
    </div>
  );
}

export default JsonValidatorComponent;
