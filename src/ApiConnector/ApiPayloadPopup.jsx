import React, { useState } from 'react';
import axios from 'axios';
import Ajv from 'ajv';

import payloadSchema from '../SCHEMA/billerConfigurtationJson'

// 1) Create an AJV instance
const ajv = new Ajv();

// 2) Define the JSON Schema matching your new payload structure
const billerPayloadSchema = payloadSchema;

// 3) Compile the schema into a validation function
const validator = ajv.compile(billerPayloadSchema);

// 4) Your new default payload
const defaultPayload = {
  "clientid": "12323c",
  "billerid": "asd",
  "billerConfiguration": {
    "billerSpecificConfiguration": {
      "spsBillerSeesiticConfiguratiop": {
        "billerPaymentEngineConfiguration": {
          "payeeSiteld": {
            "dataType": "LONG",
            "expression": "getLong('6266775779')",
            "expressionType": "SPEL"
          },
          "description": {
            "dataType": "STRING",
            "expression": "'Weekly Invoice for EMedg!'",
            "expressionType": "SPEL"
          },
          "lineDescription": {
            "dataType": "STRING",
            "expression": "'EModal services for weekly container'",
            "expressionType": "SPEL"
          },
          "marketplaceld": {
            "dataType": "LONG",
            "expression": "1",
            "expressionType": "SPEL"
          },
          "payGroup": {
            "dataType": "STRING",
            "expression": "'EXPENSE'",
            "expressionType": "SPEL"
          },
          "termsid": {
            "dataType": "INTEGER",
            "expression": "getLong('10020')",
            "expressionType": "SPEL"
          },
          "commonConfiguration": {
            "icsCommonConfiguration": {
              "invoiceConfiguration": {
                "configMap": {
                  "GM&GM_PER_LOAD-1": {
                    "configAttributes": {
                      "invoiceBatchSchedule": {
                        "timeZone": "PST",
                        "type": "Cron",
                        "value": "0 0 0? * * 2021/1"
                      },
                      "invoiceNumberExpression": {
                        "expression": "concat('INV-', uniqueValue)",
                        "expressionType": "SpringExpression",
                        "name": "invoicenumber"
                      },
                      "configidentifier": {
                        "billerid": "EMOD",
                        "configid": "GM&GM_PER_LOAD-1",
                        "customerid": "gmzn1.R9.9.A3GHJ1MPQI7ZOW"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

/**
 * Helper to set a deeply nested value (e.g. "billerConfiguration.billerSpecificConfiguration...")
 */
function setDeepValue(obj, path, value) {
  const parts = path.split('.');
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    if (!current[key]) current[key] = {};
    current = current[key];
  }
  current[parts[parts.length - 1]] = value;
}

/**
 * Renders a form dynamically based on the structure of `data`.
 * - Objects: recursively render child properties.
 * - Primitives: render an <input> field.
 */
function DynamicForm({ data, onChange, path = '' }) {
  if (Array.isArray(data)) {
    // If data is an array, render each item recursively
    return (
      <div style={{ marginLeft: '20px' }}>
        {data.map((item, index) => (
          <div key={index} style={{ marginBottom: '5px' }}>
            <label>{index}:</label>
            <DynamicForm
              data={item}
              onChange={onChange}
              path={path ? `${path}.${index}` : `${index}`}
            />
          </div>
        ))}
      </div>
    );
  } else if (data && typeof data === 'object') {
    // If data is an object, iterate over its keys
    return (
      <div style={{ marginLeft: '20px', borderLeft: '1px solid #ccc', paddingLeft: '10px' }}>
        {Object.entries(data).map(([key, value]) => {
          const newPath = path ? `${path}.${key}` : key;
          return (
            <div key={key} style={{ marginBottom: '5px' }}>
              <label>{key}:</label>
              <DynamicForm data={value} onChange={onChange} path={newPath} />
            </div>
          );
        })}
      </div>
    );
  } else {
    // Primitive value (string, number, etc.)
    return (
      <input
        style={{ marginLeft: '10px' }}
        type={typeof data === 'number' ? 'number' : 'text'}
        value={data}
        onChange={(e) => onChange(path, e.target.value)}
      />
    );
  }
}

/**
 * Main component that:
 * 1. Shows a button to open a popup.
 * 2. Displays a raw JSON text area.
 * 3. Dynamically renders a form from the JSON structure.
 * 4. Validates the payload before sending to the API.
 */
const ApiPayloadPopupComplex = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [formPayload, setFormPayload] = useState(defaultPayload);
  const [rawPayload, setRawPayload] = useState(JSON.stringify(defaultPayload, null, 2));
  const [error, setError] = useState(null);

  // Keep the form and raw JSON in sync
  const handleDynamicChange = (path, value) => {
    const updated = JSON.parse(JSON.stringify(formPayload));
    setDeepValue(updated, path, value);
    setFormPayload(updated);
    setRawPayload(JSON.stringify(updated, null, 2));
  };

  // Parse raw JSON changes into formPayload
  const handleRawPayloadChange = (e) => {
    setRawPayload(e.target.value);
    try {
      const parsed = JSON.parse(e.target.value);
      setFormPayload(parsed);
      setError(null);
    } catch {
      setError('Invalid JSON');
    }
  };

  // Validate and submit
  const handleSubmit = async () => {
    try {
      const payloadToSend = JSON.parse(rawPayload);
      // Validate using AJV
      const valid = validator(payloadToSend);
      if (!valid) {
        setError('Validation error: ' + ajv.errorsText(validator.errors));
        return;
      }

      // POST to your API endpoint
      // Replace 'API_LINK' with your real endpoint
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
      <button onClick={() => setShowPopup(true)}>Open Payload Popup</button>

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
            width: '80vw'
          }}
        >
          <h2>Dynamic Payload Editor</h2>

          {error && <div style={{ color: 'red' }}>{error}</div>}

          {/* Raw JSON Textarea */}
          <div style={{ marginBottom: '20px' }}>
            <label>Raw JSON Payload:</label>
            <br />
            <textarea
              value={rawPayload}
              onChange={handleRawPayloadChange}
              onSelect={}
              rows={12}
              cols={60}
              style={{ fontFamily: 'monospace', width: '100%' }}
            />
          </div>

          {/* Dynamic Form */}
          <h3>Form Fields (Generated from JSON)</h3>
          <DynamicForm data={formPayload} onChange={handleDynamicChange} />

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