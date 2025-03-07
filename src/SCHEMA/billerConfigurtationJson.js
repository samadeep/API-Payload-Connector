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
