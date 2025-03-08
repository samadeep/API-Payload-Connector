import React, { useState } from 'react';
import axios from 'axios';
import Ajv from 'ajv';

// Create an AJV instance
const ajv = new Ajv();

// Define the JSON Schema matching your new payload structure
const payloadSchema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "BillerPayload",
  "type": "object",
  "properties": {
    "clientid": { "type": "string" },
    "billerid": { "type": "string" },
    "billerConfiguration": {
      "type": "object",
      "properties": {
        "billerSpecificConfiguration": {
          "type": "object",
          "properties": {
            "spsBillerSeesiticConfiguratiop": {
              "type": "object",
              "properties": {
                "billerPaymentEngineConfiguration": {
                  "type": "object",
                  "properties": {
                    "payeeSiteld": {
                      "type": "object",
                      "properties": {
                        "dataType": { "type": "string" },
                        "expression": { "type": "string" },
                        "expressionType": { "type": "string" }
                      },
                      "required": ["dataType", "expression", "expressionType"],
                      "additionalProperties": false
                    },
                    "description": {
                      "type": "object",
                      "properties": {
                        "dataType": { "type": "string" },
                        "expression": { "type": "string" },
                        "expressionType": { "type": "string" }
                      },
                      "required": ["dataType", "expression", "expressionType"],
                      "additionalProperties": false
                    },
                    "lineDescription": {
                      "type": "object",
                      "properties": {
                        "dataType": { "type": "string" },
                        "expression": { "type": "string" },
                        "expressionType": { "type": "string" }
                      },
                      "required": ["dataType", "expression", "expressionType"],
                      "additionalProperties": false
                    },
                    "marketplaceld": {
                      "type": "object",
                      "properties": {
                        "dataType": { "type": "string" },
                        "expression": { "type": "string" },
                        "expressionType": { "type": "string" }
                      },
                      "required": ["dataType", "expression", "expressionType"],
                      "additionalProperties": false
                    },
                    "payGroup": {
                      "type": "object",
                      "properties": {
                        "dataType": { "type": "string" },
                        "expression": { "type": "string" },
                        "expressionType": { "type": "string" }
                      },
                      "required": ["dataType", "expression", "expressionType"],
                      "additionalProperties": false
                    },
                    "termsid": {
                      "type": "object",
                      "properties": {
                        "dataType": { "type": "string" },
                        "expression": { "type": "string" },
                        "expressionType": { "type": "string" }
                      },
                      "required": ["dataType", "expression", "expressionType"],
                      "additionalProperties": false
                    },
                    "commonConfiguration": {
                      "type": "object",
                      "properties": {
                        "icsCommonConfiguration": {
                          "type": "object",
                          "properties": {
                            "invoiceConfiguration": {
                              "type": "object",
                              "properties": {
                                "configMap": {
                                  "type": "object",
                                  "properties": {
                                    "GM&GM_PER_LOAD-1": {
                                      "type": "object",
                                      "properties": {
                                        "configAttributes": {
                                          "type": "object",
                                          "properties": {
                                            "invoiceBatchSchedule": {
                                              "type": "object",
                                              "properties": {
                                                "timeZone": { "type": "string" },
                                                "type": { "type": "string" },
                                                "value": { "type": "string" }
                                              },
                                              "required": ["timeZone", "type", "value"],
                                              "additionalProperties": false
                                            },
                                            "invoiceNumberExpression": {
                                              "type": "object",
                                              "properties": {
                                                "expression": { "type": "string" },
                                                "expressionType": { "type": "string" },
                                                "name": { "type": "string" }
                                              },
                                              "required": ["expression", "expressionType", "name"],
                                              "additionalProperties": false
                                            },
                                            "configidentifier": {
                                              "type": "object",
                                              "properties": {
                                                "billerid": { "type": "string" },
                                                "configid": { "type": "string" },
                                                "customerid": { "type": "string" }
                                              },
                                              "required": ["billerid", "configid", "customerid"],
                                              "additionalProperties": false
                                            }
                                          },
                                          "required": [
                                            "invoiceBatchSchedule",
                                            "invoiceNumberExpression",
                                            "configidentifier"
                                          ],
                                          "additionalProperties": false
                                        }
                                      },
                                      "required": ["configAttributes"],
                                      "additionalProperties": false
                                    }
                                  },
                                  "required": ["GM&GM_PER_LOAD-1"],
                                  "additionalProperties": false
                                }
                              },
                              "required": ["configMap"],
                              "additionalProperties": false
                            }
                          },
                          "required": ["invoiceConfiguration"],
                          "additionalProperties": false
                        }
                      },
                      "required": ["icsCommonConfiguration"],
                      "additionalProperties": false
                    }
                  },
                  "required": [
                    "payeeSiteld",
                    "description",
                    "lineDescription",
                    "marketplaceld",
                    "payGroup",
                    "termsid",
                    "commonConfiguration"
                  ],
                  "additionalProperties": false
                }
              },
              "required": ["billerPaymentEngineConfiguration"],
              "additionalProperties": false
            }
          },
          "required": ["spsBillerSeesiticConfiguratiop"],
          "additionalProperties": false
        }
      },
      "required": ["billerSpecificConfiguration"],
      "additionalProperties": false
    }
  },
  "required": ["clientid", "billerid", "billerConfiguration"],
  "additionalProperties": false
};

// Compile the schema into a validation function.
const validator = ajv.compile(payloadSchema);

// New default payload matching your new format.
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
 * Helper function to set a deeply nested value in an object using dot-notation.
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
 * DynamicForm: Recursively renders a form based on `data`.
 * Each input gets an `id` based on its path and a harmless onSelect handler.
 */
function DynamicForm({ data, onChange, path = '' }) {
  if (data === undefined || data === null) {
    return (
      <input
        id={path}
        type="text"
        value=""
        onChange={(e) => onChange(path, e.target.value)}
        onSelect={(e) => {}}
      />
    );
  }
  
  if (Array.isArray(data)) {
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
  } else if (typeof data === 'object') {
    return (
      <div style={{ marginLeft: '20px', borderLeft: '1px solid #ccc', paddingLeft: '10px' }}>
        {Object.entries(data).map(([key, value]) => {
          const newPath = path ? `${path}.${key}` : key;
          return (
            <div key={key} style={{ marginBottom: '5px' }}>
              <label htmlFor={newPath}>{key}:</label>
              <DynamicForm data={value} onChange={onChange} path={newPath} />
            </div>
          );
        })}
      </div>
    );
  } else {
    return (
      <input
        id={path}
        style={{ marginLeft: '10px' }}
        type={typeof data === 'number' ? 'number' : 'text'}
        value={data || ""}
        onChange={(e) => onChange(path, e.target.value)}
        onSelect={(e) => {}}
      />
    );
  }
}

/**
 * Main component: Renders a dynamic payload editor popup.
 * It keeps a raw JSON textarea in sync with a dynamic form,
 * validates the payload using AJV, and submits via axios.
 */
const ApiPayloadPopupComplex = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [formPayload, setFormPayload] = useState(defaultPayload);
  const [rawPayload, setRawPayload] = useState(JSON.stringify(defaultPayload, null, 2));
  const [error, setError] = useState(null);

  // Update payload based on dynamic form changes.
  const handleDynamicChange = (path, value) => {
    const updated = JSON.parse(JSON.stringify(formPayload));
    setDeepValue(updated, path, value);
    setFormPayload(updated);
    setRawPayload(JSON.stringify(updated, null, 2));
  };

  // Update payload when raw JSON is edited.
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

  // Validate payload using AJV and submit via axios.
  const handleSubmit = async () => {
    try {
      const payloadToSend = JSON.parse(rawPayload);
      const valid = validator(payloadToSend);
      if (!valid) {
        setError('Validation error: ' + ajv.errorsText(validator.errors));
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
          {/* Raw JSON Editor */}
          <div style={{ marginBottom: '20px' }}>
            <label>Raw JSON Payload:</label>
            <br />
            <textarea
              value={rawPayload}
              onChange={handleRawPayloadChange}
              rows={12}
              cols={60}
              style={{ fontFamily: 'monospace', width: '100%' }}
              onSelect={(e) => {}}
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
