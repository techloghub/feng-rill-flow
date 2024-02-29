import { TreeSelectWidget } from '@/components/Widget';

export function nodeList() {
  return {
    plugin: [
      {
        id: 5,
        name: 'test_task_template',
        node_type: 'template', // or template
        category: 'function',
        icon: {
          type: 'img_base64',
          value:
            'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAAC3BJREFUeF7tXXuMHVUZ/76ZvY3txgpiAkXbGEUgGiUGjFpLrYaiAimiGElQULStJljZ3Xu+uRur24vdvXPO7G6RWJUiqICpj0SQR4zFR1UqUcEHBnwU8f2MQdSuG7d75zOn3C232zt3Zu6de+64c07SP7rzne/x+373mzmPOYNgW6ERwEJHb4MHS4CCk8ASwBKg4AgUPHxbASwBCo5AwcO3FcASoOAIFDx8WwEsAQqOQMHDtxXAEqDgCBQ8fFsBLAEKjkDBw7cVwBKg4AgUPHxbASwBCo5AwcO3FcASoOAIFDx8WwEsAQqOQMHDtxXAEqDgCBQ8fFsBLAGWHgJSyh2IeCkAvCjj6PbX6/Xq6Ojo/oz19k3dkqwASqlvAsCGHqG6n4he0yPdxtUuVQJwL5EkoiWD25IJpDnhSilLgIS/AEuAhEA1i9kK0AFoJrvYCpAc7UJVgLS/3CgipdWTPB3mJS0B2mBuCWCekJlYzCpxWenJJKgeKcllBZienn7m4cOHt+mYmfmLlUrl4TTxZ5W4rPQEQXBeGIbrdAye5+1IE0uvZXNHgLGxsZWDg4P/bAr83wCwi4jGkoChlDoXAL7dSjbtvTuKAI7jnFsul++L80dKearOOSIeIfNCS+tHnJ1urueOAEqp7wPAy1oE9XMAkET06VYBSynPQMRxAHhzFCBpgY8ZTewdGBgQw8PDf2xlLwiCrcwsAeAZLa4PE9GubhKXVd9cEUBKuRER98UE9w1mvtrzvJ9puVqtdqLrujUA2BoHSsYEWDCniMhb+I/v++td172OmV/azp+0vsTF1un1XBEgCIJ/MPMJSYJh5mnHcWaZ+QNJ5LVMWtCTzicw8yFEHAKA17erQM1+MvONnudtSep7r+RyQwCl1HYA+HCvAgWArxHRxjT6lVJfaSQ1TbfEssz8bM/z/pS4Qw8E80SAXszf/wIA7qrX6x8fHR19rBP8pqamTg/D8B3M/E4AOKUTHVF9EPE+IYR+aO1bywUBlFJfAoBLIlDQQ8C06/pPIKIvhNAPYZm0nTt3ri6VSsOIeE1ahcx8DyJeGNFvAxF9K63OrOT7ToAgCF7CzD+JCOheIjo/CIIxZk46fr4tDEM/7dxBUkB931/nOM5wG8IeVcXMv3Qcp+o4zsP1ev3rAHBSCzuPE1Grvyd1qSu5vhNASnkAEde2ioKZL/Y87059bXp6+rT5+fkJAHhLRMQ/BgCfiD7fFSIJO0spL0dE/fT/4oguo0TkL1yTUl6LiB9sJYuIW4QQNyY0nalYXwkQBMFmZt4TEdHNRPSuxdd833+D4zhB820BEYNDhw7trFar/8oUnRhl4+Pjq0ql0icAYFOT6N4wDCuVSuV3zd0nJiZOGhgY0KW+5e1sZmbGrVaroUn/ta1+E+AgM5/WIuhZ13VfNTIy8qMoQJRS7wOA65n5fM/z7jUNXLM9KaUeil4RhuHWdvsFlVLvBYCPRfg6SUTCdBx9I4BSSg/59NDvuMbM1bzNmWeVGKWUJut5EXGf6XmeHrkYa30hwPj4+MmlUukgADx9caTM/Kjruq8sl8t/N4aCQUO+71/oOM7dESbvJKKLDbrTn1uAlHIPIm6OCHQzEX3SJAimbQVBcAszv72VXUTcJIS4y5RPxitArVZ7reu6ekjUqvV0y3Vj3eB8RNzIzGcBwMmNfzMA8BcA+Csz3+04zneFEPf3KgkTExMvdF33B4i4ooWNg0R0eq9sL9ZrnABKqS8vemo+6lMYhhdUKhU9/Zpp27Vr16q5ubmtjaqjl2iTtO8BwEeIaG8S4bQy7YaFzFz2PG8qrc5O5I0SIAiCy5g5CtDPEtHbOgmiXR+llJ43uA4AkiZ+sbo7EHGrEOJvWfo2Njb2tBUrVvwUEVuNgiAMwxMqlUrzvogszR/VZZQASildVl8REcluZt69sMybRbSNyZrbMtD1BDNv9DzvgQx0HVGhlHo1M29DxDdF6LyBiN6Tlb0oPcYI4Pv+GsdxftsuIGb+MwBoEuiNHV21IAiuYeZMN124rrtmZGTk9904ppQ6pZH40Tg9aZev4/S1um6MAHrOPwzDfYioH7zi2g8RUQohvhAn2Oq6lPKNiHh7J31jCPrg7Ozs+h07dvynE92Tk5NXhmF4LQCsieuvF5A8z7soTq7b68YIoB1tJEbPj5+R0HG9DlAmIj1nkLhJKR9AxLPbdLgZAO4Pw/CR2dnZh1auXHni/Pz8mdovRNTPIS9v03cPEcXuPmru7/v+Wr1riZnXJwkCEb9ar9e3LJ5OTtI3rYxRAmjnGkOxit6gk9TZNDODUsotiHhDlO7mBaYoGaWUfm64POq64zjnlMvlB5P4r5T6jJ4mTiILAL9CxJoQ4qaE8l2LGSfAgseTk5Nnh2H4oaghYXNkjuNcUS6Xb00Sbbtff5p7qlLqAgC4J8Jm4iqglNLJvCrOd03y5cuXT2/bts3oglbfCLAASGOYptcF2t0W1hHRgTgQpZSbEFHPM7RqekyfajNHEAR7mLnVjOXjMzMzq6rV6lycT0opXe30ptWodrvjONvL5fIjcbp6cb3vBFgISkqp988fXT9vDrZUKp06NDSkRwhtm1JKPzQet1+g061XtVrtuXrGDgCetdgwIl4khIiqEEfFfd+/zHGcVnMfutwLIUTmD6txODVfzw0BtFPdvIkzNja2bHBw8L+tgmfmqzzP+1QaYJoq1OcA4K0t+k4QUeyO5FqttsF1XX1iyeLW02nvpLEuGQJMTU2trtfrx2zCWAChXq+/YHR09NGkoDTLSSl3IuJxiUbEm4QQ747TaQkQh1DT9W4qgJTyHETU5fqYxsyPeZ73/BRuHCOqlNK/fl0FFutNNE63BEiBvCVACrAyErW3gBgg7S0gI6YlUdNNBbAPgUkQPl4mNxXADgM7S2C3vfpOADsRBMWcCLJTwceNKooxFWwXg9oW7aW9GGSXg5MvByPisIn1AWPPAHZDCECaDSEAsI+IXtftQ15cf2MEsFvCnkxFii1hfyCi1XEJ7Pa6MQI0grebQhsZS7ApdDcRXd1tguP6GyWA3Rb+VDrabQvXm2OXLVu2dmho6DdxCez2ulECNKqAfTHkyf2R7c4LGBFCTHeb3CT9jRPAvhoGEPNq2AEiOnKqqIlmnAA6KPtyaPTLocx8ied5d5hIvrbRFwLY18Nbvx6OiLcKIZLuIM6EI30hQONZwB4QsSiFiHiWEOKhTDKbUEnfCKD9C4LAHhHTSFSadx8S5jaRWL8JYA+JeooAKz3P0yejG219JUDjgbDwx8QBwJVEdIvRzDeM9Z0ASQ6KbHwJNNH3AgDg/+2gyF8T0fP6kfy+jQIWB1vwo2LXE9F3Ck2AxqigcIdFm1rxa0euvt8CFpwr4nHxc3Nzz9m+fXvLL46Yqgi5IUBjWFiYD0Yg4keFEPq00762XBHAfjLGPBdyRYDGs8CS/2gUIr5fCHG9+XQfbzF3BLCfjTNLi9wRQIdvPxxpjgS5JEC34Xfzilmz7az0dBtPL/tbArRB1xKgl9Troe6sEpeVnh6G2rXqQlWArtFqKEhz2lhWNnulxxKgA2QtAToAzWSXpJ987dQnS4BOkTPUzxIgOdBL9Ragj2XbkByGVJK5ON4tlcdthJckARobSC7t4JOzcbjur9fr1XafhotTkLfrS5IAeQM5z/5YAuQ5OwZ8swQwAHKeTVgC5Dk7BnyzBDAAcp5NWALkOTsGfLMEMABynk1YAuQ5OwZ8swQwAHKeTVgC5Dk7BnyzBDAAcp5NWALkOTsGfLMEMABynk1YAuQ5OwZ8swQwAHKeTVgC5Dk7BnyzBDAAcp5NWALkOTsGfLMEMABynk1YAuQ5OwZ8swQwAHKeTVgC5Dk7BnyzBDAAcp5NWALkOTsGfLMEMABynk1YAuQ5OwZ8+x/KkOLMeCJQyAAAAABJRU5ErkJggg==',
        },
        task_yaml: {
          name: 'chatgptExecutor',
          category: 'function',
          pattern: 'task_async',
          resourceName: 'chatgpt://',
          inputMappings: [
            {
              source: '$.context.prompt',
              target: '$.input.prompt',
            },
          ],
          outputMappings: [
            {
              source: '$.output.result',
              target: '$.context.gpt_response',
            },
            {
              source: '$.output.error',
              target: '$.context.error',
            },
          ],

          resourceProtocol: 'chatgpt',
          parameters: {
            apikey: '123',
          },
        },
        meta_data: {
          icon: '',
          fields: {
            category: {
              type: 'string',
              name: '节点类型',
              required: true,
              default_value: 'function',
            },
            resource_name: {
              type: 'string',
              name: '资源名称',
              required: true,
              default_value: '',
            },
            resource_protocol: {
              type: 'string',
              name: '资源协议',
              required: true,
              options: [
                {
                  label: 'http',
                  value: 'http',
                },
                {
                  label: '阿里通义千问',
                  value: 'ali_ai',
                },
                {
                  label: 'k8s 服务',
                  value: 'service',
                },
              ],
            },
            request_type: {
              type: 'string',
              name: '请求类型',
              required: false,
              default_value: 'POST',
              options: [
                {
                  label: 'POST',
                  value: 'POST',
                },
                {
                  label: 'GET',
                  value: 'GET',
                },
              ],
            },
            pattern: {
              type: 'string',
              name: '同步类型',
              required: true,
              options: [
                {
                  label: '同步',
                  value: 'task_scheduler',
                },
                {
                  label: '异步',
                  value: 'task_async',
                },
              ],
            },
            input_mappings: {
              type: 'list',
              name: '输入映射',
              required: true,
              data: {
                type: 'object',
                fields: {
                  source: {
                    type: 'string',
                    name: '输入来源',
                    required: true,
                  },
                  target: {
                    type: 'string',
                    name: '输入目标',
                    required: true,
                  },
                  reference: {
                    type: 'string',
                    name: 'commonMapping 引用',
                    required: true,
                  },
                  transform: {
                    type: 'string',
                    name: '输入映射处理 aviator 表达式',
                    required: false,
                  },
                  tolerance: {
                    type: 'boolean',
                    name: '容忍错误',
                    required: false,
                  },
                  required_group: [['source', 'target'], ['reference']],
                },
              },
            },
            output_mappings: {
              type: 'list',
              name: '输入映射',
              required: true,
              data: {
                type: 'object',
                fields: {
                  source: {
                    type: 'string',
                    name: '输入来源',
                    required: true,
                  },
                  target: {
                    type: 'string',
                    name: '输入目标',
                    required: true,
                  },
                  reference: {
                    type: 'string',
                    name: 'commonMapping 引用',
                    required: true,
                  },
                  transform: {
                    type: 'string',
                    name: '输入映射处理 aviator 表达式',
                    required: false,
                  },
                  tolerance: {
                    type: 'boolean',
                    name: '容忍错误',
                    required: false,
                  },
                  required_group: [['source', 'target'], ['reference']],
                },
              },
            },
            tolerance: {
              type: 'boolean',
              name: '是否容错',
              required: false,
              default_value: false,
            },
            success_conditions: {
              type: 'list',
              name: '成功条件',
              required: false,
              data: {
                type: 'string',
              },
            },
            fail_conditions: {
              type: 'list',
              name: '失败条件',
              required: false,
              data: {
                type: 'string',
              },
            },
            retry: {
              type: 'object',
              required: false,
              fields: {
                max_retry_times: {
                  type: 'integer',
                  name: '最大重试次数',
                  required: true,
                },
                interval_in_seconds: {
                  type: 'integer',
                  name: '间隔时间',
                  required: false,
                  default_value: 0,
                },
                multiplier: {
                  type: 'integer',
                  name: '放大系数',
                  required: false,
                  default_value: 1,
                },
              },
            },
            next: {
              type: 'string',
              name: '下一节点',
              required: false,
            },
          },
        },
        schema: {
          type: 'object',
          required: ['appkey'],
          properties: {
            appkey: {
              title: 'appkey',
              properties: {
                attr: {
                  title: '类型',
                  type: 'string',
                  enum: ['input', 'reference'],
                  enumNames: ['input', 'reference'],
                  'ui:width': '40%',
                },
                input: {
                  title: '文本',
                  type: 'string',
                  'ui:hidden': "{{parentFormData.attr !== 'input'}}",
                  'ui:width': '60%',
                },
                reference: {
                  title: 'reference',
                  type: 'string',
                  default: '',
                  'ui:hidden': "{{parentFormData.attr !== 'reference'}}",
                  'ui:width': '60%',
                  'ui:widget': 'SelectByTypeWidget',
                  'ui:treeData': [
                    {
                      title: 'statuses',
                      value: 'statuses',
                      children: [
                        {
                          title: 'visible',
                          value: 'visible',
                          children: [
                            {
                              title: 'type',
                              value: 'type',
                            },
                            {
                              title: 'list_id',
                              value: 'list_id',
                            },
                          ],
                        },
                        {
                          title: 'created_at',
                          value: 'created_at',
                        },
                        {
                          title: 'id',
                          value: 'id',
                        },
                        {
                          title: 'mid',
                          value: 'mid',
                        },
                      ],
                    },
                  ],
                },
              },
            },
          },
        },
        output: {
          type: 'object',
          properties: {
            statuses: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  visible: {
                    type: 'object',
                    properties: {
                      type: { type: 'string' },
                      list_id: { type: 'string' },
                    },
                  },
                  created_at: { type: 'string' },
                  id: { type: 'integer' },
                  mid: { type: 'string' },
                },
              },
            },
          },
        },
      },
      // {
      //   "id": 6,
      //   "name": "demo_template",
      //   "node_type": "template", // or template
      //   "category": "function",
      //   "icon": {
      //     "type": "img_base64",
      //     "value": "data:image/jpeg;base64,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"
      //   },
      //   "task_yaml": {
      //     "next": "gptOutputProcessor",
      //     "name": "chatgptExecutor",
      //     "category": "function",
      //     "pattern": "task_async",
      //     "resourceName": "chatgpt://",
      //     "inputMappings": [
      //       {
      //         "source": "$.context.prompt",
      //         "target": "$.input.prompt"
      //       }
      //     ],
      //     "outputMappings": [
      //       {
      //         "source": "$.output.result",
      //         "target": "$.context.gpt_response"
      //       },
      //       {
      //         "source": "$.output.error",
      //         "target": "$.context.error"
      //       }
      //     ],
      //
      //     "resourceProtocol": "chatgpt",
      //     "parameters": {
      //       "apikey": "123"
      //     }
      //   },
      //   "meta_data": [
      //     {
      //       "icon": "",
      //       "fields": {
      //         "resource_name": {
      //           "type": "string",
      //           "name": "资源名称",
      //           "required": true,
      //           "default_value": ""
      //         },
      //         "resource_protocol": {
      //           "type": "string",
      //           "name": "资源协议",
      //           "required": true,
      //           "options": [
      //             {
      //               "name": "http",
      //               "value": "http"
      //             },
      //             {
      //               "name": "阿里通义千问",
      //               "value": "ali_ai"
      //             },
      //             {
      //               "name": "k8s 服务",
      //               "value": "service"
      //             }
      //           ]
      //         },
      //         "request_type": {
      //           "type": "string",
      //           "name": "请求类型",
      //           "required": false,
      //           "default_value": "POST",
      //           "options": [
      //             {
      //               "name": "POST",
      //               "value": "POST"
      //             },
      //             {
      //               "name": "GET",
      //               "value": "GET"
      //             }
      //           ]
      //         },
      //         "pattern": {
      //           "type": "string",
      //           "name": "同步类型",
      //           "required": true,
      //           "options": [
      //             {
      //               "name": "同步",
      //               "value": "task_scheduler"
      //             },
      //             {
      //               "name": "异步",
      //               "value": "task_async"
      //             }
      //           ]
      //         },
      //         "input_mappings": {
      //           "type": "list",
      //           "name": "输入映射",
      //           "required": true,
      //           "data": {
      //             "type": "object",
      //             "fields": {
      //               "source": {
      //                 "type": "string",
      //                 "name": "输入来源",
      //                 "required": true
      //               },
      //               "target": {
      //                 "type": "string",
      //                 "name": "输入目标",
      //                 "required": true
      //               },
      //               "reference": {
      //                 "type": "string",
      //                 "name": "commonMapping 引用",
      //                 "required": true
      //               },
      //               "transform": {
      //                 "type": "string",
      //                 "name": "输入映射处理 aviator 表达式",
      //                 "required": false
      //               },
      //               "tolerance": {
      //                 "type": "boolean",
      //                 "name": "容忍错误",
      //                 "required": false
      //               },
      //               "required_group": [
      //                 ["source", "target"],
      //                 ["reference"]
      //               ]
      //             }
      //           }
      //         },
      //         "output_mappings": {
      //           "type": "list",
      //           "name": "输入映射",
      //           "required": true,
      //           "data": {
      //             "type": "object",
      //             "fields": {
      //               "source": {
      //                 "type": "string",
      //                 "name": "输入来源",
      //                 "required": true
      //               },
      //               "target": {
      //                 "type": "string",
      //                 "name": "输入目标",
      //                 "required": true
      //               },
      //               "reference": {
      //                 "type": "string",
      //                 "name": "commonMapping 引用",
      //                 "required": true
      //               },
      //               "transform": {
      //                 "type": "string",
      //                 "name": "输入映射处理 aviator 表达式",
      //                 "required": false
      //               },
      //               "tolerance": {
      //                 "type": "boolean",
      //                 "name": "容忍错误",
      //                 "required": false
      //               },
      //               "required_group": [
      //                 ["source", "target"],
      //                 ["reference"]
      //               ]
      //             }
      //           }
      //         },
      //         "tolerance": {
      //           "type": "boolean",
      //           "name": "是否容错",
      //           "required": false,
      //           "default_value": false
      //         },
      //         "success_conditions": {
      //           "type": "list",
      //           "name": "成功条件",
      //           "required": false,
      //           "data": {
      //             "type": "string"
      //           }
      //         },
      //         "fail_conditions": {
      //           "type": "list",
      //           "name": "失败条件",
      //           "required": false,
      //           "data": {
      //             "type": "string"
      //           }
      //         },
      //         "retry": {
      //           "type": "object",
      //           "required": false,
      //           "fields": {
      //             "max_retry_times": {
      //               "type": "integer",
      //               "name": "最大重试次数",
      //               "required": true
      //             },
      //             "interval_in_seconds": {
      //               "type": "integer",
      //               "name": "间隔时间",
      //               "required": false,
      //               "default_value": 0
      //             },
      //             "multiplier": {
      //               "type": "integer",
      //               "name": "放大系数",
      //               "required": false,
      //               "default_value": 1
      //             }
      //           }
      //         },
      //         "next": {
      //           "type": "string",
      //           "name": "下一节点",
      //           "required": false
      //         }
      //       }
      //     }
      //   ],
      //   "schema": {
      //     type: 'object',
      //     required: [
      //       'name',
      //       'appkey',
      //     ],
      //     properties: {
      //       name: {
      //         type: 'string',
      //         title: '节点名称',
      //         default: '',
      //       },
      //       appkey: {
      //         title: "appkey",
      //         properties: {
      //           attr: {
      //             title: '类型',
      //             type: 'string',
      //             enum: [
      //               'input',
      //               'reference'
      //             ],
      //             enumNames: [
      //               'input',
      //               'reference'
      //             ],
      //             'ui:width': '30%'
      //           },
      //           input: {
      //             title: '文本',
      //             type: 'string',
      //             'ui:hidden': "{{parentFormData.attr !== 'input'}}",
      //             'ui:width': '40%'
      //           },
      //           reference: {
      //             title: 'reference',
      //             type: 'string',
      //             // pattern: '^[0-9]+$',
      //             // message: {
      //             //   pattern: '输入正确得分'
      //             // },
      //             // default: JSON.stringify([{"title":"parent11111","value":"parent1","children":[{"title":"parent 1-0","value":"parent 1-0","children":[{"title":"my leaf","value":"leaf1"},{"title":"your leaf","value":"leaf2"}]},{"title":"parent 1-1","value":"parent 1-1"}]}]),
      //             default: 's',
      //             'ui:hidden': "{{parentFormData.attr !== 'reference'}}",
      //             'ui:width': '40%',
      //             "ui:widget": 'SelectByTypeWidget',
      //             'ui:treeData': [{
      //               "title": "parent11111",
      //               "value": "parent1",
      //               "children": [{
      //                 "title": "parent 1-0",
      //                 "value": "parent 1-0",
      //                 "children": [{"title": "my leaf", "value": "leaf1"}, {"title": "your leaf", "value": "leaf2"}]
      //               }, {"title": "parent 1-1", "value": "parent 1-1"}]
      //             }],
      //           },
      //         }
      //       }
      //     }
      //   },
      //   "output": {
      //     "statuses": [
      //       {
      //         "visible": {
      //           "type": "integer",
      //           "list_id": "integer"
      //         },
      //         "created_at": "string",
      //         "id": "integer",
      //         "mid": "string"
      //       },
      //       {
      //         "visible1": {
      //           "type1": "integer",
      //           "list_id1": "integer"
      //         },
      //         "created_at1": "string",
      //         "id1": "integer",
      //         "mid1": "string"
      //       }
      //     ],
      //     "video": {
      //       "id": "long",
      //       "file_size": "long",
      //     },
      //
      //   }
      // }
    ],
    logical: [],
    function: [
      {
        category: 'function',
        node_type: 'meta', // or template
        icon: {
          type: 'icon',
          value: 'ant-design:api-outlined',
        },
        fields: {
          name: {
            type: 'string',
            name: '节点名称',
            required: true,
            default_value: '',
          },
          resource_name: {
            type: 'string',
            name: '资源名称',
            required: true,
            default_value: '',
          },
          category: {
            type: 'string',
            name: '节点类型',
            required: true,
            default_value: 'function',
          },
          resource_protocol: {
            type: 'string',
            name: '资源协议',
            required: true,
          },
          request_type: {
            type: 'string',
            name: '请求类型',
            required: false,
            default_value: 'POST',
            options: [
              {
                label: 'POST',
                value: 'POST',
              },
              {
                label: 'GET',
                value: 'GET',
              },
            ],
          },
          pattern: {
            type: 'string',
            name: '同步类型',
            required: true,
            options: [
              {
                label: '同步',
                value: 'task_scheduler',
              },
              {
                label: '异步',
                value: 'task_async',
              },
            ],
          },
          input_mappings: {
            type: 'list',
            name: '输入映射',
            required: true,
            data: {
              type: 'object',
              fields: {
                source: {
                  type: 'string',
                  name: '输入来源',
                  required: true,
                },
                target: {
                  type: 'string',
                  name: '输入目标',
                  required: true,
                },
                reference: {
                  type: 'string',
                  name: 'commonMapping 引用',
                  required: true,
                },
                transform: {
                  type: 'string',
                  name: '输入映射处理 aviator 表达式',
                  required: false,
                },
                tolerance: {
                  type: 'boolean',
                  name: '容忍错误',
                  required: false,
                },
                required_group: [['source', 'target'], ['reference']],
              },
            },
          },
          output_mappings: {
            type: 'list',
            name: '输出映射',
            required: true,
            data: {
              type: 'object',
              fields: {
                source: {
                  type: 'string',
                  name: '输出来源',
                  required: true,
                },
                target: {
                  type: 'string',
                  name: '输出目标',
                  required: true,
                },
                reference: {
                  type: 'string',
                  name: 'commonMapping 引用',
                  required: true,
                },
                transform: {
                  type: 'string',
                  name: '输入映射处理 aviator 表达式',
                  required: false,
                },
                tolerance: {
                  type: 'boolean',
                  name: '容忍错误',
                  required: false,
                },
                required_group: [['source', 'target'], ['reference']],
              },
            },
          },
          tolerance: {
            type: 'boolean',
            name: '是否容错',
            required: false,
            default_value: false,
          },
          success_conditions: {
            type: 'list',
            name: '成功条件',
            required: false,
            data: {
              type: 'string',
            },
          },
          fail_conditions: {
            type: 'list',
            name: '失败条件',
            required: false,
            data: {
              type: 'string',
            },
          },
          retry: {
            type: 'object',
            name: '任务重试设置',
            required: false,
            fields: {
              max_retry_times: {
                type: 'integer',
                name: '最大重试次数',
                required: true,
              },
              interval_in_seconds: {
                type: 'integer',
                name: '间隔时间',
                required: false,
                default_value: 0,
              },
              multiplier: {
                type: 'integer',
                name: '放大系数',
                required: false,
                default_value: 1,
              },
            },
          },
          next: {
            type: 'string',
            name: '下一节点',
            required: false,
          },
        },
      },
      {
        category: 'rillflow',
        node_type: 'meta', // or template
        icon: {
          type: 'icon',
          value: 'ant-design:deployment-unit-outlined',
        },
        fields: {
          name: {
            type: 'string',
            name: '节点名称',
            required: true,
            default_value: '',
          },
          resource_name: {
            type: 'string',
            name: '资源名称',
            required: true,
            default_value: '',
          },
          resource_protocol: {
            type: 'string',
            name: '资源协议',
            required: true,
          },
          request_type: {
            type: 'string',
            name: '请求类型',
            required: false,
            default_value: 'POST',
            options: [
              {
                label: 'POST',
                value: 'POST',
              },
              {
                label: 'GET',
                value: 'GET',
              },
            ],
          },
          pattern: {
            type: 'string',
            name: '同步类型',
            required: true,
            options: [
              {
                label: '同步',
                value: 'task_scheduler',
              },
              {
                label: '异步',
                value: 'task_async',
              },
            ],
          },
          input_mappings: {
            type: 'list',
            name: '输入映射',
            required: true,
            data: {
              type: 'object',
              fields: {
                source: {
                  type: 'string',
                  name: '输入来源',
                  required: true,
                },
                target: {
                  type: 'string',
                  name: '输入目标',
                  required: true,
                },
                reference: {
                  type: 'string',
                  name: 'commonMapping 引用',
                  required: true,
                },
                transform: {
                  type: 'string',
                  name: '输入映射处理 aviator 表达式',
                  required: false,
                },
                tolerance: {
                  type: 'boolean',
                  name: '容忍错误',
                  required: false,
                },
                required_group: [['source', 'target'], ['reference']],
              },
            },
          },
          output_mappings: {
            type: 'list',
            name: '输出映射',
            required: true,
            data: {
              type: 'object',
              fields: {
                source: {
                  type: 'string',
                  name: '输出来源',
                  required: true,
                },
                target: {
                  type: 'string',
                  name: '输出目标',
                  required: true,
                },
                reference: {
                  type: 'string',
                  name: 'commonMapping 引用',
                  required: true,
                },
                transform: {
                  type: 'string',
                  name: '输入映射处理 aviator 表达式',
                  required: false,
                },
                tolerance: {
                  type: 'boolean',
                  name: '容忍错误',
                  required: false,
                },
                required_group: [['source', 'target'], ['reference']],
              },
            },
          },
          tolerance: {
            type: 'boolean',
            name: '是否容错',
            required: false,
            default_value: false,
          },
          success_conditions: {
            type: 'list',
            name: '成功条件',
            required: false,
            data: {
              type: 'string',
            },
          },
          fail_conditions: {
            type: 'list',
            name: '失败条件',
            required: false,
            data: {
              type: 'string',
            },
          },
          retry: {
            type: 'object',
            name: '任务重试设置',
            required: false,
            fields: {
              max_retry_times: {
                type: 'integer',
                name: '最大重试次数',
                required: true,
              },
              interval_in_seconds: {
                type: 'integer',
                name: '间隔时间',
                required: false,
                default_value: 0,
              },
              multiplier: {
                type: 'integer',
                name: '放大系数',
                required: false,
                default_value: 1,
              },
            },
          },
          next: {
            type: 'string',
            name: '下一节点',
            required: false,
          },
        },
      },
      {
        category: 'inputSchema',
        node_type: 'meta', // or template
        icon: {
          type: 'icon',
          value: 'ant-design:edit-outlined',
        },
        fields: {
          input_schema: {
            type: 'list',
            name: '输入参数',
            required: true,
            data: {
              type: 'object',
              fields: {
                paramsName: {
                  type: 'string',
                  name: '参数名',
                  required: true,
                },
                paramsType: {
                  type: 'string',
                  name: '参数类型',
                  required: true,
                  options: [
                    {
                      label: 'String',
                      value: 'String',
                    },
                    {
                      label: 'Number',
                      value: 'Number',
                    },
                    {
                      label: 'Boolean',
                      value: 'Boolean',
                    },
                    {
                      label: 'JSON',
                      value: 'JSON',
                    },
                  ],
                },
                paramsRequired: {
                  type: 'boolean',
                  name: '参数是否必填',
                  required: true,
                },
                paramsDesc: {
                  type: 'string',
                  name: '参数描述',
                  required: false,
                },
              },
            },
          },
        },
      },
    ],
  };
}

export function templateNode() {
  return {
    id: 5,
    name: 'test_task_template',
    node_type: 'template', // or template
    category: 'function',
    icon: '',
    task_yaml: {
      next: 'gptOutputProcessor',
      name: 'chatgptExecutor',
      category: 'function',
      pattern: 'task_async',
      resourceName: 'chatgpt://',
      inputMappings: [
        {
          source: '$.context.prompt',
          target: '$.input.prompt',
        },
      ],
      outputMappings: [
        {
          source: '$.output.result',
          target: '$.context.gpt_response',
        },
        {
          source: '$.output.error',
          target: '$.context.error',
        },
      ],

      resourceProtocol: 'chatgpt',
      parameters: {
        apikey: '123',
      },
    },
    schema: {},
    output: {
      statuses: [
        {
          visible: {
            type: 'integer',
            list_id: 'integer',
          },
          created_at: 'string',
          id: 'integer',
          mid: 'string',
        },
      ],
    },
    meta_data: {
      icon: '',
      fields: {
        resource_name: {
          type: 'string',
          name: '资源名称',
          required: true,
          default_value: '',
        },
        resource_protocol: {
          type: 'string',
          name: '资源协议',
          required: true,
          options: [
            {
              label: 'http',
              value: 'http',
            },
            {
              label: '阿里通义千问',
              value: 'ali_ai',
            },
            {
              label: 'k8s 服务',
              value: 'service',
            },
          ],
        },
        request_type: {
          type: 'string',
          name: '请求类型',
          required: false,
          default_value: 'POST',
          options: [
            {
              label: 'POST',
              value: 'POST',
            },
            {
              label: 'GET',
              value: 'GET',
            },
          ],
        },
        pattern: {
          type: 'string',
          name: '同步类型',
          required: true,
          options: [
            {
              label: '同步',
              value: 'task_scheduler',
            },
            {
              label: '异步',
              value: 'task_async',
            },
          ],
        },
        input_mappings: {
          type: 'list',
          name: '输入映射',
          required: true,
          data: {
            type: 'object',
            fields: {
              source: {
                type: 'string',
                name: '输入来源',
                required: true,
              },
              target: {
                type: 'string',
                name: '输入目标',
                required: true,
              },
              reference: {
                type: 'string',
                name: 'commonMapping 引用',
                required: true,
              },
              transform: {
                type: 'string',
                name: '输入映射处理 aviator 表达式',
                required: false,
              },
              tolerance: {
                type: 'boolean',
                name: '容忍错误',
                required: false,
              },
              required_group: [['source', 'target'], ['reference']],
            },
          },
        },
        output_mappings: {
          type: 'list',
          name: '输入映射',
          required: true,
          data: {
            type: 'object',
            fields: {
              source: {
                type: 'string',
                name: '输入来源',
                required: true,
              },
              target: {
                type: 'string',
                name: '输入目标',
                required: true,
              },
              reference: {
                type: 'string',
                name: 'commonMapping 引用',
                required: true,
              },
              transform: {
                type: 'string',
                name: '输入映射处理 aviator 表达式',
                required: false,
              },
              tolerance: {
                type: 'boolean',
                name: '容忍错误',
                required: false,
              },
              required_group: [['source', 'target'], ['reference']],
            },
          },
        },
        tolerance: {
          type: 'boolean',
          name: '是否容错',
          required: false,
          default_value: false,
        },
        success_conditions: {
          type: 'list',
          name: '成功条件',
          required: false,
          data: {
            type: 'string',
          },
        },
        fail_conditions: {
          type: 'list',
          name: '失败条件',
          required: false,
          data: {
            type: 'string',
          },
        },
        retry: {
          type: 'object',
          required: false,
          fields: {
            max_retry_times: {
              type: 'integer',
              name: '最大重试次数',
              required: true,
            },
            interval_in_seconds: {
              type: 'integer',
              name: '间隔时间',
              required: false,
              default_value: 0,
            },
            multiplier: {
              type: 'integer',
              name: '放大系数',
              required: false,
              default_value: 1,
            },
          },
        },
        next: {
          type: 'string',
          name: '下一节点',
          required: false,
        },
      },
    },
  };
}

export function customWidgets() {
  return {
    SelectByTypeWidget: TreeSelectWidget,
  };
}
