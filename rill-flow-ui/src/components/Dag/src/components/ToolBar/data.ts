
export function getInputSchema()  {
  return {
    "inputSchema": {
      "type": "array",
      "x-component": "ArrayItems",
      "x-decorator": "FormItem",
      "title": "输入参数",
      "required": false,
      "items": {
        "type": "object",
        "properties": {
          "space": {
            "type": "void",
            "x-component": "Space",
            "properties": {
              "sort": {
                "type": "void",
                "x-decorator": "FormItem",
                "x-component": "ArrayItems.SortHandle"
              },
              "paramsName": {
                "type": "string",
                "title": "参数名",
                "required": true,
                "x-decorator": "FormItem",
                "x-component": "Input"
              },
              "paramsType": {
                "type": "string",
                "title": "参数类型",
                "required": true,
                "x-decorator": "FormItem",
                "x-component": "Select",
                "enum": [
                  {
                    "label": "String",
                    "value": "String"
                  },
                  {
                    "label": "Number",
                    "value": "Number"
                  },
                  {
                    "label": "Boolean",
                    "value": "Boolean"
                  },
                  {
                    "label": "JSON",
                    "value": "JSON"
                  }
                ],
                "x-component-props": {
                  "style": {
                    "width": "100px"
                  }
                }
              },
              "paramsRequired": {
                "type": "boolean",
                "title": "参数是否必填",
                "x-decorator": "FormItem",
                "x-component": "Switch",
                "required": true,
                "default": true,
                "x-component-props": {
                  "style": {}
                }
              },
              "paramsDesc": {
                "type": "string",
                "title": "参数描述",
                "required": false,
                "x-decorator": "FormItem",
                "x-component": "Input"
              },
              "remove": {
                "type": "void",
                "x-decorator": "FormItem",
                "x-component": "ArrayItems.Remove"
              }
            }
          }
        }
      },
      "properties": {
        "add": {
          "type": "void",
          "title": "添加输入参数",
          "x-component": "ArrayItems.Addition"
        }
      }
    }
  }
}
