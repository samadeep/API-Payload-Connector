import React, { useState } from 'react';
import axios from 'axios';
import Ajv from 'ajv';

// Create an AJV instance
const ajv = new Ajv();

// Define a JSON Schema matching the default payload
const payloadSchema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "DefaultPayloadSchema",
  "type": "object",
  "properties": {
    "clientId": { "type": "string" },                 // Required
    "externalId": { "type": "string" },               // Required
    "invoiceDescription": { "type": "string" },       // Optional
    "services": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "type": { "type": "string" },              // Required
          "description": { "type": "string" }          // Required
        },
        "required": ["type", "description"],
        "additionalProperties": false
      }
    },
    "groupDescription": { "type": "string" },         // Optional
    "groupType": { "type": "string" },                // Optional
    "invoiceDate": { "type": "string" },              // Optional
    "someNumber": { "type": "number" },               // Optional
    "nested": {
      "type": "object",
      "properties": {
        "nestedKey": { "type": "string" },            // Required
        "deep": { "type": "string" }                  // Required
      },
      "required": ["nestedKey", "deep"],
      "additionalProperties": false
    },
    "commonConfigurations": {
      "type": "object",
      "properties": {
        "configName": { "type": "string" },           // Required
        "schemaDefinition": {
          "type": "object",
          "properties": {
            "SCHEMA_PAYLOAD_1": {
              "type": "object",
              "properties": {
                "type": { "type": "string" },       // Required
                "expression": { "type": "string" }  // Required
              },
              "required": ["type", "expression"],
              "additionalProperties": false
            },
            "SCHEMA_PAYLOAD_2": {
              "type": "object",
              "properties": {
                "type": { "type": "string" },       // Required
                "expression": { "type": "string" }  // Required
              },
              "required": ["type", "expression"],
              "additionalProperties": false
            }
          },
          "required": ["SCHEMA_PAYLOAD_1", "SCHEMA_PAYLOAD_2"],
          "additionalProperties": false
        },
        "configuration": {
          "type": "object",
          "properties": {
            "billing": { "type": "string" },       // Required
            "loadParam": { "type": "string" },       // Required
            "customerId": { "type": "string" }       // Required
          },
          "required": ["billing", "loadParam", "customerId"],
          "additionalProperties": false
        }
      },
      "required": ["configName", "schemaDefinition", "configuration"],
      "additionalProperties": false
    }
  },
  // Only essential fields are required at the top level.
  "required": ["clientId", "externalId", "services", "nested", "commonConfigurations"],
  "additionalProperties": false
};

// Compile the schema into a validation function.
const validator = ajv.compile(payloadSchema);

/**
 * Helper function to set a deeply nested value in an object
 * using dot-notation or array indices (e.g. "services.0.type").
 */
function setDeepValue(obj, path, value) {
  const parts = path.split('.');
  let current = obj;

  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    // If key is numeric, treat as array index
    if (/^\d+$/.test(key)) {
      const index = parseInt(key, 10);
      // Ensure the current path is an array
      if (!Array.isArray(current)) {
        current = [];
      }
      if (!current[index]) {
        current[index] = {};
      }
      current = current[index];
    } else {
      // If the key doesn't exist, create an object
      if (!current[key]) {
        current[key] = {};
      }
      current = current[key];
    }
  }

  const lastKey = parts[parts.length - 1];
  // If lastKey is numeric, treat as array index
  if (/^\d+$/.test(lastKey)) {
    const index = parseInt(lastKey, 10);
    if (!Array.isArray(current)) {
      current = [];
    }
    current[index] = value;
  } else {
    current[lastKey] = value;
  }
}

/**
 * This component has:
 * 1. A button to open a popup.
 * 2. A raw JSON text area for direct editing of the payload.
 * 3. A form that matches the structure of the JSON exactly.
 * 4. An axios POST request on submit.
 */
const ApiPayloadPopupComplex = () => {
  const [showPopup, setShowPopup] = useState(false);

  // Default payload structure.
  const defaultPayload = {
    clientId: '',
    externalId: '',
    invoiceDescription: '',
    services: [
      {
        type: '',
        description: '',
      },
    ],
    groupDescription: '',
    groupType: '',
    invoiceDate: '',
    someNumber: 0,
    nested: {
      nestedKey: '',
      deep: '',
    },
    commonConfigurations: {
      configName: '',
      schemaDefinition: {
        SCHEMA_PAYLOAD_1: {
          type: '',
          expression: '',
        },
        SCHEMA_PAYLOAD_2: {
          type: '',
          expression: '',
        },
      },
      configuration: {
        billing: '',
        loadParam: '',
        customerId: '',
      },
    },
  };

  // State for the structured object.
  const [formPayload, setFormPayload] = useState(defaultPayload);

  // State for the raw JSON text area.
  const [rawPayload, setRawPayload] = useState(JSON.stringify(defaultPayload, null, 2));

  // For displaying errors.
  const [error, setError] = useState(null);

  /**
   * Whenever the user edits the raw JSON, we try to parse it
   * and update the form fields. If JSON is invalid, set an error.
   */
  const handleRawPayloadChange = (e) => {
    const { value } = e.target;
    setRawPayload(value);

    try {
      const parsed = JSON.parse(value);
      setFormPayload(parsed);
      setError(null);
    } catch (err) {
      setError('Invalid JSON');
    }
  };

  /**
   * Handle changes in any of the form fields. We interpret the `name` prop
   * (e.g., "services.0.type") to update the nested property in the object.
   */
  const handleFormChange = (e) => {
    const { name, value } = e.target;

    const updatedPayload = JSON.parse(JSON.stringify(formPayload)); // deep clone
    setDeepValue(updatedPayload, name, value);

    setFormPayload(updatedPayload);
    setRawPayload(JSON.stringify(updatedPayload, null, 2));
  };

  /**
   * Submit the current JSON to your API via axios.
   * This function first validates the payload against the JSON Schema.
   * Replace 'API_LINK' with your real endpoint.
   */
  const handleSubmit = async () => {
    try {
      const payloadToSend = JSON.parse(rawPayload);

      // Validate the payload against the JSON Schema
      const isValid = validator(payloadToSend);
      if (!isValid) {
        setError("Validation error: " + ajv.errorsText(validator.errors));
        return;
      }

      const response = await axios.post('API_LINK', payloadToSend);
      
      console.log('API response:', response.data);
      setShowPopup(false);
    } catch (err) {
      console.error('Error calling API:', err);
      setError('API call failed');
    }
  };

  return (
    <div>
      <button onClick={() => setShowPopup(true)}>Open Complex API Payload Popup</button>

      {showPopup && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            border: '1px solid black',
            zIndex: 1000,
            maxHeight: '80vh',
            overflowY: 'auto',
            width: '80vw',
          }}
        >
          <h2>API Payload Editor</h2>

          {error && <div style={{ color: 'red' }}>{error}</div>}

          {/* Raw JSON Text Area */}
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="rawPayload">Raw JSON Payload:</label>
            <br />
            <textarea
              id="rawPayload"
              value={rawPayload}
              onChange={handleRawPayloadChange}
              rows={12}
              cols={60}
              style={{ fontFamily: 'monospace', width: '100%' }}
            />
          </div>

          {/* Form Fields - exactly mirroring the JSON structure */}
          <h3>Form Fields (Tree Structure)</h3>

          <div>
            <label>clientId:</label>
            <input
              name="clientId"
              type="text"
              value={formPayload.clientId}
              onChange={handleFormChange}
            />
          </div>

          <div>
            <label>externalId:</label>
            <input
              name="externalId"
              type="text"
              value={formPayload.externalId}
              onChange={handleFormChange}
            />
          </div>

          <div>
            <label>invoiceDescription:</label>
            <input
              name="invoiceDescription"
              type="text"
              value={formPayload.invoiceDescription}
              onChange={handleFormChange}
            />
          </div>

          <div>
            <label>services[0].type:</label>
            <input
              name="services.0.type"
              type="text"
              value={formPayload.services[0].type}
              onChange={handleFormChange}
            />
          </div>

          <div>
            <label>services[0].description:</label>
            <input
              name="services.0.description"
              type="text"
              value={formPayload.services[0].description}
              onChange={handleFormChange}
            />
          </div>

          <div>
            <label>groupDescription:</label>
            <input
              name="groupDescription"
              type="text"
              value={formPayload.groupDescription}
              onChange={handleFormChange}
            />
          </div>

          <div>
            <label>groupType:</label>
            <input
              name="groupType"
              type="text"
              value={formPayload.groupType}
              onChange={handleFormChange}
            />
          </div>

          <div>
            <label>invoiceDate:</label>
            <input
              name="invoiceDate"
              type="text"
              value={formPayload.invoiceDate}
              onChange={handleFormChange}
            />
          </div>

          <div>
            <label>someNumber:</label>
            <input
              name="someNumber"
              type="number"
              value={formPayload.someNumber}
              onChange={handleFormChange}
            />
          </div>

          <h4>nested</h4>
          <div style={{ marginLeft: '20px' }}>
            <div>
              <label>nested.nestedKey:</label>
              <input
                name="nested.nestedKey"
                type="text"
                value={formPayload.nested.nestedKey}
                onChange={handleFormChange}
              />
            </div>
            <div>
              <label>nested.deep:</label>
              <input
                name="nested.deep"
                type="text"
                value={formPayload.nested.deep}
                onChange={handleFormChange}
              />
            </div>
          </div>

          <h4>commonConfigurations</h4>
          <div style={{ marginLeft: '20px' }}>
            <div>
              <label>commonConfigurations.configName:</label>
              <input
                name="commonConfigurations.configName"
                type="text"
                value={formPayload.commonConfigurations.configName}
                onChange={handleFormChange}
              />
            </div>

            <h5>commonConfigurations.schemaDefinition</h5>
            <div style={{ marginLeft: '20px' }}>
              <div>
                <label>SCHEMA_PAYLOAD_1.type:</label>
                <input
                  name="commonConfigurations.schemaDefinition.SCHEMA_PAYLOAD_1.type"
                  type="text"
                  value={formPayload.commonConfigurations.schemaDefinition.SCHEMA_PAYLOAD_1.type}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <label>SCHEMA_PAYLOAD_1.expression:</label>
                <input
                  name="commonConfigurations.schemaDefinition.SCHEMA_PAYLOAD_1.expression"
                  type="text"
                  value={formPayload.commonConfigurations.schemaDefinition.SCHEMA_PAYLOAD_1.expression}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <label>SCHEMA_PAYLOAD_2.type:</label>
                <input
                  name="commonConfigurations.schemaDefinition.SCHEMA_PAYLOAD_2.type"
                  type="text"
                  value={formPayload.commonConfigurations.schemaDefinition.SCHEMA_PAYLOAD_2.type}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <label>SCHEMA_PAYLOAD_2.expression:</label>
                <input
                  name="commonConfigurations.schemaDefinition.SCHEMA_PAYLOAD_2.expression"
                  type="text"
                  value={formPayload.commonConfigurations.schemaDefinition.SCHEMA_PAYLOAD_2.expression}
                  onChange={handleFormChange}
                />
              </div>
            </div>

            <h5>commonConfigurations.configuration</h5>
            <div style={{ marginLeft: '20px' }}>
              <div>
                <label>billing:</label>
                <input
                  name="commonConfigurations.configuration.billing"
                  type="text"
                  value={formPayload.commonConfigurations.configuration.billing}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <label>loadParam:</label>
                <input
                  name="commonConfigurations.configuration.loadParam"
                  type="text"
                  value={formPayload.commonConfigurations.configuration.loadParam}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <label>customerId:</label>
                <input
                  name="commonConfigurations.configuration.customerId"
                  type="text"
                  value={formPayload.commonConfigurations.configuration.customerId}
                  onChange={handleFormChange}
                />
              </div>
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <button onClick={handleSubmit}>Submit Payload</button>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiPayloadPopupComplex;
