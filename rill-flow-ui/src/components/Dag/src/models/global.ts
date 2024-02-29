import { reactive } from 'vue';

// export const globalGridAttr = reactive({
//   type: 'mesh',
//   size: 10,
//   color: '#e5e5e5',
//   thickness: 1,
//   colorSecond: '#d0d0d0',
//   thicknessSecond: 1,
//   factor: 4,
//   bgColor: '#e5e5e5',
//   showImage: true,
//   repeat: 'watermark',
//   angle: 30,
//   position: 'center',
//   bgSize: JSON.stringify({ width: 150, height: 150 }),
//   opacity: 0.1,
//
//   stroke: '#5F95FF',
//   strokeWidth: 1,
//   connector: 'normal',
//   label: '',
//
//   nodeStroke: '#5F95FF',
//   nodeStrokeWidth: 1,
//   nodeFill: '#ffffff',
//   nodeFontSize: 12,
//   nodeColor: '#080808',
//   nodeUsers: '',
// });

export class GraphNodeReferenceUpdateParam {
  nodeId: string;
  nodeParamKey: string;
  nodeParamValue: string;
  /**
   * @type {TemplateNodeParamType}
   */
  type: string;

  constructor(nodeId: string, nodeParamKey: string, nodeParamValue: string, type: string) {
    this.nodeId = nodeId;
    this.nodeParamKey = nodeParamKey;
    this.nodeParamValue = nodeParamValue;
    this.type = type;
  }
}

export class DagMetaInfo {
  workspace: string;
  dagName: string;
  type: string;
  version: string;
  alias: string;
  inputSchema: string;

  constructor(
    workspace: string,
    dagName: string,
    type: string,
    version: string,
    inputSchema: string,
    alias: string,
  ) {
    this.workspace = workspace;
    this.dagName = dagName;
    this.type = type;
    this.version = version;
    this.alias = alias;
    this.inputSchema = inputSchema;
  }

  setInputSchema(inputSchema: []) {
    this.inputSchema = JSON.stringify(inputSchema);
  }
}
