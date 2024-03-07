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
  id: string;

  constructor(
    workspace: string,
    dagName: string,
    type: string,
    version: string,
    inputSchema: string,
    alias: string,
    id: string,
  ) {
    this.workspace = workspace;
    this.dagName = dagName;
    this.type = type;
    this.version = version;
    this.alias = alias;
    this.inputSchema = inputSchema;
    this.id = id;
  }

  setInputSchema(inputSchema: []) {
    this.inputSchema = JSON.stringify(inputSchema);
  }
}
