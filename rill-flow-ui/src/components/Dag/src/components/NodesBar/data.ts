import {h} from "vue";


export function nodeList() {

  return {
    "plugin": [
      {
        "id": 5,
        "name": "test_task_template",
        "node_type": "template", // or template
        "category": "function",
        "icon": {
          "type": "img_base64",
          "value": "data:image/jpeg;base64,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"
        },
        "task_yaml": {
          "next": "gptOutputProcessor",
          "name": "chatgptExecutor",
          "category": "function",
          "pattern": "task_async",
          "resourceName": "chatgpt://",
          "inputMappings": [
            {
              "source": "$.context.prompt",
              "target": "$.input.prompt"
            }
          ],
          "outputMappings": [
            {
              "source": "$.output.result",
              "target": "$.context.gpt_response"
            },
            {
              "source": "$.output.error",
              "target": "$.context.error"
            }
          ],

          "resourceProtocol": "chatgpt",
          "parameters": {
            "apikey": "123"
          }
        },
        "meta_data": [
          {
            "icon": "",
            "fields": {
              "resource_name": {
                "type": "string",
                "name": "资源名称",
                "required": true,
                "default_value": ""
              },
              "resource_protocol": {
                "type": "string",
                "name": "资源协议",
                "required": true,
                "options": [
                  {
                    "name": "http",
                    "value": "http"
                  },
                  {
                    "name": "阿里通义千问",
                    "value": "ali_ai"
                  },
                  {
                    "name": "k8s 服务",
                    "value": "service"
                  }
                ]
              },
              "request_type": {
                "type": "string",
                "name": "请求类型",
                "required": false,
                "default_value": "POST",
                "options": [
                  {
                    "name": "POST",
                    "value": "POST"
                  },
                  {
                    "name": "GET",
                    "value": "GET"
                  }
                ]
              },
              "pattern": {
                "type": "string",
                "name": "同步类型",
                "required": true,
                "options": [
                  {
                    "name": "同步",
                    "value": "task_scheduler"
                  },
                  {
                    "name": "异步",
                    "value": "task_async"
                  }
                ]
              },
              "input_mappings": {
                "type": "list",
                "name": "输入映射",
                "required": true,
                "data": {
                  "type": "object",
                  "fields": {
                    "source": {
                      "type": "string",
                      "name": "输入来源",
                      "required": true
                    },
                    "target": {
                      "type": "string",
                      "name": "输入目标",
                      "required": true
                    },
                    "reference": {
                      "type": "string",
                      "name": "commonMapping 引用",
                      "required": true
                    },
                    "transform": {
                      "type": "string",
                      "name": "输入映射处理 aviator 表达式",
                      "required": false
                    },
                    "tolerance": {
                      "type": "boolean",
                      "name": "容忍错误",
                      "required": false
                    },
                    "required_group": [
                      ["source", "target"],
                      ["reference"]
                    ]
                  }
                }
              },
              "output_mappings": {
                "type": "list",
                "name": "输入映射",
                "required": true,
                "data": {
                  "type": "object",
                  "fields": {
                    "source": {
                      "type": "string",
                      "name": "输入来源",
                      "required": true
                    },
                    "target": {
                      "type": "string",
                      "name": "输入目标",
                      "required": true
                    },
                    "reference": {
                      "type": "string",
                      "name": "commonMapping 引用",
                      "required": true
                    },
                    "transform": {
                      "type": "string",
                      "name": "输入映射处理 aviator 表达式",
                      "required": false
                    },
                    "tolerance": {
                      "type": "boolean",
                      "name": "容忍错误",
                      "required": false
                    },
                    "required_group": [
                      ["source", "target"],
                      ["reference"]
                    ]
                  }
                }
              },
              "tolerance": {
                "type": "boolean",
                "name": "是否容错",
                "required": false,
                "default_value": false
              },
              "success_conditions": {
                "type": "list",
                "name": "成功条件",
                "required": false,
                "data": {
                  "type": "string"
                }
              },
              "fail_conditions": {
                "type": "list",
                "name": "失败条件",
                "required": false,
                "data": {
                  "type": "string"
                }
              },
              "retry": {
                "type": "object",
                "required": false,
                "fields": {
                  "max_retry_times": {
                    "type": "integer",
                    "name": "最大重试次数",
                    "required": true
                  },
                  "interval_in_seconds": {
                    "type": "integer",
                    "name": "间隔时间",
                    "required": false,
                    "default_value": 0
                  },
                  "multiplier": {
                    "type": "integer",
                    "name": "放大系数",
                    "required": false,
                    "default_value": 1
                  }
                }
              },
              "next": {
                "type": "string",
                "name": "下一节点",
                "required": false
              }
            }
          }
        ],
        "schema": {
          type: 'object',
          required: [
            'userName',
            'age',
          ],
          properties: {
            userName: {
              type: 'string',
              title: '用户名',
              default: 'Liu.Jun',
              'ui:options': {
                renderScopedSlots: {
                  default: (props) => h('span', "123")
                }
              }
            },
            age: {
              type: 'number',
              title: '年龄',
              'ui:options': {
                renderScopedSlots: {
                  append: (props) => h('span', "123")
                }
              }
            },
            bio: {
              type: 'string',
              title: '签名',
              minLength: 10,
              default: '知道的越多、就知道的越少',
              'ui:options': {
                placeholder: '请输入你的签名',
                type: 'textarea',
                rows: 1,
                renderScopedSlots: {
                  default: (props) => h('span', "123")
                }
              }
            }
          }
        },
        "output": {
          "statuses": [
            {
              "visible": {
                "type": "integer",
                "list_id": "integer"
              },
              "created_at": "string",
              "id": "integer",
              "mid": "string"
            }
          ]
        }
      }
    ],
    "logical": [],
    "function": [
      {
        "category": "function",
        "node_type": "meta", // or template
        "icon": {
          "type": "icon",
          "value": "ant-design:api-outlined"
        },
        "fields": {
          "resource_name": {
            "type": "string",
            "name": "资源名称",
            "required": true,
            "default_value": ""
          },
          "resource_protocol": {
            "type": "string",
            "name": "资源协议",
            "required": true
          },
          "request_type": {
            "type": "string",
            "name": "请求类型",
            "required": false,
            "default_value": "POST",
            "options": [
              {
                "name": "POST",
                "value": "POST"
              },
              {
                "name": "GET",
                "value": "GET"
              }
            ]
          },
          "pattern": {
            "type": "string",
            "name": "同步类型",
            "required": true,
            "options": [
              {
                "name": "同步",
                "value": "task_scheduler"
              },
              {
                "name": "异步",
                "value": "task_async"
              }
            ]
          },
          "input_mappings": {
            "type": "list",
            "name": "输入映射",
            "required": true,
            "data": {
              "type": "object",
              "fields": {
                "source": {
                  "type": "string",
                  "name": "输入来源",
                  "required": true
                },
                "target": {
                  "type": "string",
                  "name": "输入目标",
                  "required": true
                },
                "reference": {
                  "type": "string",
                  "name": "commonMapping 引用",
                  "required": true
                },
                "transform": {
                  "type": "string",
                  "name": "输入映射处理 aviator 表达式",
                  "required": false
                },
                "tolerance": {
                  "type": "boolean",
                  "name": "容忍错误",
                  "required": false
                },
                "required_group": [
                  ["source", "target"],
                  ["reference"]
                ]
              }
            }
          },
          "output_mappings": {
            "type": "list",
            "name": "输出映射",
            "required": true,
            "data": {
              "type": "object",
              "fields": {
                "source": {
                  "type": "string",
                  "name": "输出来源",
                  "required": true
                },
                "target": {
                  "type": "string",
                  "name": "输出目标",
                  "required": true
                },
                "reference": {
                  "type": "string",
                  "name": "commonMapping 引用",
                  "required": true
                },
                "transform": {
                  "type": "string",
                  "name": "输入映射处理 aviator 表达式",
                  "required": false
                },
                "tolerance": {
                  "type": "boolean",
                  "name": "容忍错误",
                  "required": false
                },
                "required_group": [
                  ["source", "target"],
                  ["reference"]
                ]
              }
            }
          },
          "tolerance": {
            "type": "boolean",
            "name": "是否容错",
            "required": false,
            "default_value": false
          },
          "success_conditions": {
            "type": "list",
            "name": "成功条件",
            "required": false,
            "data": {
              "type": "string"
            }
          },
          "fail_conditions": {
            "type": "list",
            "name": "失败条件",
            "required": false,
            "data": {
              "type": "string"
            }
          },
          "retry": {
            "type": "object",
            "required": false,
            "fields": {
              "max_retry_times": {
                "type": "integer",
                "name": "最大重试次数",
                "required": true
              },
              "interval_in_seconds": {
                "type": "integer",
                "name": "间隔时间",
                "required": false,
                "default_value": 0
              },
              "multiplier": {
                "type": "integer",
                "name": "放大系数",
                "required": false,
                "default_value": 1
              }
            }
          },
          "next": {
            "type": "string",
            "name": "下一节点",
            "required": false
          }
        }
      },
    ]
  }

}

export function templateNode() {
  return {
    "id": 5,
    "name": "test_task_template",
    "node_type": "template", // or template
    "category": "function",
    "icon": "",
    "task_yaml": {
      "next": "gptOutputProcessor",
      "name": "chatgptExecutor",
      "category": "function",
      "pattern": "task_async",
      "resourceName": "chatgpt://",
      "inputMappings": [
        {
          "source": "$.context.prompt",
          "target": "$.input.prompt"
        }
      ],
      "outputMappings": [
        {
          "source": "$.output.result",
          "target": "$.context.gpt_response"
        },
        {
          "source": "$.output.error",
          "target": "$.context.error"
        }
      ],

      "resourceProtocol": "chatgpt",
      "parameters": {
        "apikey": "123"
      }
    },
    "schema": {},
    "output": {
      "statuses": [
        {
          "visible": {
            "type": "integer",
            "list_id": "integer"
          },
          "created_at": "string",
          "id": "integer",
          "mid": "string"
        }
      ]
    },
    "meta_data": {
      "icon": "",
      "fields": {
        "resource_name": {
          "type": "string",
          "name": "资源名称",
          "required": true,
          "default_value": ""
        },
        "resource_protocol": {
          "type": "string",
          "name": "资源协议",
          "required": true,
          "options": [
            {
              "name": "http",
              "value": "http"
            },
            {
              "name": "阿里通义千问",
              "value": "ali_ai"
            },
            {
              "name": "k8s 服务",
              "value": "service"
            }
          ]
        },
        "request_type": {
          "type": "string",
          "name": "请求类型",
          "required": false,
          "default_value": "POST",
          "options": [
            {
              "name": "POST",
              "value": "POST"
            },
            {
              "name": "GET",
              "value": "GET"
            }
          ]
        },
        "pattern": {
          "type": "string",
          "name": "同步类型",
          "required": true,
          "options": [
            {
              "name": "同步",
              "value": "task_scheduler"
            },
            {
              "name": "异步",
              "value": "task_async"
            }
          ]
        },
        "input_mappings": {
          "type": "list",
          "name": "输入映射",
          "required": true,
          "data": {
            "type": "object",
            "fields": {
              "source": {
                "type": "string",
                "name": "输入来源",
                "required": true
              },
              "target": {
                "type": "string",
                "name": "输入目标",
                "required": true
              },
              "reference": {
                "type": "string",
                "name": "commonMapping 引用",
                "required": true
              },
              "transform": {
                "type": "string",
                "name": "输入映射处理 aviator 表达式",
                "required": false
              },
              "tolerance": {
                "type": "boolean",
                "name": "容忍错误",
                "required": false
              },
              "required_group": [
                ["source", "target"],
                ["reference"]
              ]
            }
          }
        },
        "output_mappings": {
          "type": "list",
          "name": "输入映射",
          "required": true,
          "data": {
            "type": "object",
            "fields": {
              "source": {
                "type": "string",
                "name": "输入来源",
                "required": true
              },
              "target": {
                "type": "string",
                "name": "输入目标",
                "required": true
              },
              "reference": {
                "type": "string",
                "name": "commonMapping 引用",
                "required": true
              },
              "transform": {
                "type": "string",
                "name": "输入映射处理 aviator 表达式",
                "required": false
              },
              "tolerance": {
                "type": "boolean",
                "name": "容忍错误",
                "required": false
              },
              "required_group": [
                ["source", "target"],
                ["reference"]
              ]
            }
          }
        },
        "tolerance": {
          "type": "boolean",
          "name": "是否容错",
          "required": false,
          "default_value": false
        },
        "success_conditions": {
          "type": "list",
          "name": "成功条件",
          "required": false,
          "data": {
            "type": "string"
          }
        },
        "fail_conditions": {
          "type": "list",
          "name": "失败条件",
          "required": false,
          "data": {
            "type": "string"
          }
        },
        "retry": {
          "type": "object",
          "required": false,
          "fields": {
            "max_retry_times": {
              "type": "integer",
              "name": "最大重试次数",
              "required": true
            },
            "interval_in_seconds": {
              "type": "integer",
              "name": "间隔时间",
              "required": false,
              "default_value": 0
            },
            "multiplier": {
              "type": "integer",
              "name": "放大系数",
              "required": false,
              "default_value": 1
            }
          }
        },
        "next": {
          "type": "string",
          "name": "下一节点",
          "required": false
        }
      }
    },
  }
}


export function dagInfoDemo() {
  return {"data": {
      "dagName": "choiceSample",
      "workspace": "rillFlowSample",
      "type": "flow",
      "version": "0.0.1",
      "tasks": {
        "chatgptExecutor":{
          "next": ["randomNode"],
          "task": {
            "name": "chatgptExecutor",
            "category": "function",
            "template_id": 5,
            "pattern": "task_async",
            "resourceName": "chatgpt://",
            "inputMappings": [
              {
                "source": "$.context.prompt",
                "target": "$.input.prompt"
              }
            ],
            "outputMappings": [
              {
                "source": "$.output.result",
                "target": "$.context.gpt_response"
              },
              {
                "source": "$.output.error",
                "target": "$.context.error"
              }
            ],
            "resourceProtocol": "chatgpt",
            "parameters": {
              "apikey": {
                "type": "input",
                "source": "123"
              },
              "random_num": {
                "type": "reference",
                "source": "$.context.random_num"
              }
            }
          }
        },
        "randomNode": {
          "next": [
            "choiceOne",
            "choiceTwo"
          ],
          "task": {
            "next": "choiceOne,choiceTwo",
            "name": "randomNode",
            "outputMappings": [
              {
                "transform": " return rand(source) + 1;  ",
                "source": "$.context.input_num",
                "target": "$.context.random_num"
              }
            ],
            "category": "pass"
          }
        },
        "choiceOnePass": {
          "next": [
            "printNode"
          ],
          "task": {
            "next": "printNode",
            "name": "choiceOnePass",
            "outputMappings": [
              {
                "transform": "return 10 * source;",
                "source": "$.context.random_num",
                "target": "$.context.choice_num"
              }
            ],
            "category": "pass"
          }
        },
        "startNode": {
          "next": [
            "randomNode"
          ],
          "task": {
            "next": "randomNode",
            "name": "startNode",
            "category": "pass"
          }
        },
        "choiceOne": {
          "next": [
            "choiceOnePass"
          ],
          "task": {
            "next": "choiceOnePass",
            "name": "choiceOne",
            "inputMappings": [
              {
                "source": "$.context.random_num",
                "target": "$.input.num"
              }
            ],
            "category": "return",
            "conditions": [
              "$.input.[?(@.num < 5)]"
            ]
          }
        },
        "choiceTwoPass": {
          "next": [
            "printNode"
          ],
          "task": {
            "next": "printNode",
            "name": "choiceTwoPass",
            "outputMappings": [
              {
                "transform": "return -1 * source;",
                "source": "$.context.random_num",
                "target": "$.context.choice_num"
              }
            ],
            "category": "pass"
          }
        },
        "choiceTwo": {
          "next": [
            "choiceTwoPass"
          ],
          "task": {
            "next": "choiceTwoPass",
            "name": "choiceTwo",
            "inputMappings": [
              {
                "source": "$.context.random_num",
                "target": "$.input.num"
              }
            ],
            "category": "return",
            "conditions": [
              "$.input.[?(@.num >= 5)]"
            ]
          }
        },
        "printNode": {
          "next": [],
          "task": {
            "name": "printNode",
            "outputMappings": [
              {
                "source": "$.context.choice_num",
                "target": "$.context.result"
              }
            ],
            "category": "pass"
          }
        }
      }
    }}
}
