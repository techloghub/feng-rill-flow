import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { Graph } from '@antv/x6';
import { Node } from '@antv/x6/lib/model/node';

export const useProvideGraph = defineStore('graph', () => {
  const graphRef = ref<Graph>();
  const getGraphRef = computed(() => {
    console.log('getGraphRef', graphRef.value?.getNodes());
    return graphRef;
  });

  function setGraphRef(value) {
    graphRef.value = value;
  }

  /**
   * 根据节点id获取该节点的所有依赖节点
   * @param nodeId
   * @param isSearchNode 是否为用户要查询的节点(true: 是用户要查询的节点，false: 不是用户要查询的节点,而是该节点的依赖节点)
   * @returns {string[]} 返回该节点的所有依赖节点id
   */
  function getReferencesNodesByNodeId(nodeId: string, isSearchNode = true): string[] | null {
    const nodes: string[] = [];

    if (nodeId == null) {
      return null;
    }

    const cell = graphRef.value?.getCellById(nodeId);
    if (cell == undefined) {
      return nodes;
    }
    // 1. 根据节点id获取该节点的所有incomingEdges
    const incomingEdges = graphRef.value?.getIncomingEdges(cell);
    if (incomingEdges != null && incomingEdges.length > 0) {
      // 2. 获取incomingEdges中每个元素的source节点，并将source节点id添加到一个列表中
      incomingEdges.forEach((edge) => {
        const referenceNodeIds = getReferencesNodesByNodeId(edge.getSourceCellId(), false);
        referenceNodeIds?.forEach((nodeId) => nodes.push(nodeId));
      });
    }
    // 3. 当节点为非查询节点时，将自身节点加到列表中
    if (!isSearchNode) {
      nodes.push(nodeId);
    }
    return nodes;
  }

  function getReferences(nodeId) {
    // 1. 获取依赖节点
    const references = getReferencesNodesByNodeId(nodeId);
    console.log('getReferences ', references);

    // 2. 根据依赖节点获取模版类型的节点
    const templateNodeIds = references?.filter((nodeId) => getNodeType(nodeId) === 'template');
    console.log('templateNodeIds ', templateNodeIds);

    // 3. 获取对应的output数据
    const outputs = templateNodeIds?.map((nodeId) => {
      const cell = graphRef.value?.getCellById(nodeId);
      console.log('getReferences foreach cell', cell);
      return cell?.data.nodeDetailSchema.output;
    });
    console.log('getReferences output ', outputs);
    return [
      {
        title: 'statuses',
        value: 'statuses',
        children: [
          {
            title: 'Item',
            value: 'item',
            children: [
              {
                title: 'visible',
                value: 'visible',
                children: [
                  {
                    title: 'type',
                    value: 'type',
                    children: [],
                  },
                  {
                    title: 'list_id',
                    value: 'list_id',
                    children: [],
                  },
                ],
              },
              {
                title: 'created_at',
                value: 'created_at',
                children: [],
              },
              {
                title: 'id',
                value: 'id',
                children: [],
              },
              {
                title: 'mid',
                value: 'mid',
                children: [],
              },
            ],
          },
        ],
      },
    ];
  }

  function getNodeType(nodeId) {
    var cell = graphRef.value?.getCellById(nodeId);
    console.log("getNodeType", cell?.data.nodeDetailSchema.node_type)
    return cell?.data.nodeDetailSchema.node_type;
  }
  return {
    graphRef,
    setGraphRef,
    getGraphRef,
    getReferences,
  };
});
