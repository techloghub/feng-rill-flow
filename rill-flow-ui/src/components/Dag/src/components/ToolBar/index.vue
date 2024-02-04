<template>
  <div class="bar">
    <a-tooltip placement="bottom">
      <template #title>
        <span>清除 (Cmd + D)</span>
      </template>
      <a-button name="delete" @click="handleClick" class="item-space" size="small">
        delete
      </a-button>
    </a-tooltip>

    <a-tooltip placement="bottom">
      <template #title>
        <span>导出 (Cmd + P)</span>
      </template>
      <a-button name="toJSON" @click="handleClick" class="item-space" size="small">
        toJSON
      </a-button>
    </a-tooltip>
    <a-tooltip placement="bottom">
      <template #title>
        <span>save</span>
      </template>
      <a-button name="save" @click="handleClick" class="item-space" size="small"> save</a-button>
    </a-tooltip>
    <Modal1 @register="register1" />
  </div>
</template>

<script lang="ts">
  import { defineComponent, inject } from 'vue';
  import { DataUri } from '@antv/x6';
  import { useModal } from '@/components/Modal';
  import Modal1 from '@/components/Dag/src/components/ToolBar/Modal1.vue';
  import yaml from 'js-yaml';
  import { cloneDeep } from 'lodash-es';

  export default defineComponent({
    name: 'Index',
    components: { Modal1 },
    props: { methods: { type: Object } },
    setup: function (props) {
      const graph: any = inject('graph');

      const [register1, { openModal: openModal1 }] = useModal();

      const copy = () => {
        const cells = graph.getSelectedCells();
        if (cells.length) {
          graph.copy(cells);
        }
        return false;
      };

      const cut = () => {
        const cells = graph.getSelectedCells();
        if (cells.length) {
          graph.cut(cells);
        }
        return false;
      };

      const paste = () => {
        // const { graph } = FlowGraph;
        if (!graph.isClipboardEmpty()) {
          const cells = graph.paste({ offset: 32 });
          graph.cleanSelection();
          graph.select(cells);
        }
        return false;
      };

      const transferDag = (graph) => {
        let newDagDetail = {
          version: graph.value.options.meta.data.version,
          type: graph.value.options.meta.data.type,
          workspace: graph.value.options.meta.data.workspace,
          dagName: graph.value.options.meta.data.dagName,
          // TODO 需要下发alias参数
          alias: 'release',
        };
        // 从graph转成json
        // 节点 next
        const cellsDetail = graph.value.getCells();
        const edgeMap = {};
        const nodeToIdMap = {};
        const idToNodeMap = {};
        const nextMap = {};
        const tasks = [];
        const tasksMap = {};
        for (const cell in cellsDetail) {
          const shape = cellsDetail[cell].store.data.shape;
          if (shape === 'vue-shape') {
            console.log(
              'cell shape',
              shape,
              cell,
              cellsDetail[cell].store.data,
              cellsDetail[cell].store.data.nodeDetailParams,
            );
            // 获取节点label->id的map
            nodeToIdMap[cellsDetail[cell].store.data.label] = cellsDetail[cell].store.data.id;
            idToNodeMap[cellsDetail[cell].store.data.id] = cellsDetail[cell].store.data.label;

            // 构建提交节点json
            if (cellsDetail[cell].store.data.nodeDetailSchema.node_type === 'template') {
              console.log(
                'cell shape task_yaml',
                cellsDetail[cell].store.data.nodeDetailSchema.task_yaml,
                cellsDetail[cell],
              );
              let detail = cloneDeep(cellsDetail[cell].store.data.nodeDetailSchema.task_yaml);
              if (cellsDetail[cell].store.data.nodeDetailSchema?.taskYamlData) {
                detail = cellsDetail[cell].store.data.nodeDetailParams;
              }
              // detail.parameters = cellsDetail[cell].store.data.nodeDetailParams.parameters;
              detail.name = cellsDetail[cell].store.data.label;
              detail.id = cellsDetail[cell].store.data.nodeDetailSchema.id;
              console.log("cell shape task_yaml finish", detail, cellsDetail[cell].store.data.nodeDetailSchema.task_yaml)
              tasksMap[cellsDetail[cell].store.data.label] = detail;
            } else {
              tasksMap[cellsDetail[cell].store.data.label] =
                cellsDetail[cell].store.data.nodeDetailParams;
            }
          } else if (shape === 'edge') {
            console.log(
              'cell shape',
              shape,
              cell,
              cellsDetail[cell].store.data.source,
              cellsDetail[cell].store.data.target,
            );
            // 获取source id -> target ids列表
            if (edgeMap[cellsDetail[cell].store.data.source.cell]) {
              edgeMap[cellsDetail[cell].store.data.source.cell].push(
                cellsDetail[cell].store.data.target.cell,
              );
            } else {
              edgeMap[cellsDetail[cell].store.data.source.cell] = [
                cellsDetail[cell].store.data.target.cell,
              ];
            }
          }
        }

        console.log('edgeMap', edgeMap, nodeToIdMap);
        for (const nodeMapKey in nodeToIdMap) {
          const targets = edgeMap[nodeToIdMap[nodeMapKey]];
          let nextValue = '';
          for (const targetsKey in targets) {
            console.log(
              'nodeMap',
              nodeMapKey,
              nodeToIdMap[nodeMapKey],
              edgeMap[nodeToIdMap[nodeMapKey]],
              targets[targetsKey],
              idToNodeMap[targets[targetsKey]],
            );
            if (idToNodeMap[targets[targetsKey]] != '') {
              nextValue += idToNodeMap[targets[targetsKey]] + ',';
            }
          }
          if (nextValue !== '') {
            tasksMap[nodeMapKey]['next'] = nextValue;
          }
        }

        for (const tasksMapKey in tasksMap) {
          console.log('tasksMapKey ', tasksMapKey, tasksMap[tasksMapKey]);
          tasks.push(tasksMap[tasksMapKey]);
        }

        newDagDetail['tasks'] = tasks;
        console.log('nextMap', nextMap, tasks, newDagDetail);
        return newDagDetail;
      };

      const handleClick = (event: Event) => {
        // const { graph } = FlowGraph;
        const name = (event.currentTarget as any).name!;
        console.log('event', name, event);

        switch (name) {
          case 'undo':
            graph.history.undo();
            break;
          case 'redo':
            graph.history.redo();
            break;
          case 'delete':
            console.log('delete cell ', graph, graph.value.getSelectedCells());
            const cells = graph.value.getSelectedCells();
            console.log('delete cell ', cells);
            graph.value.clearCells();
            break;
          case 'savePNG':
            graph.toPNG(
              (dataUri: string) => {
                // 下载
                DataUri.downloadDataUri(dataUri, 'chartx.png');
              },
              {
                backgroundColor: 'white',
                padding: {
                  top: 20,
                  right: 30,
                  bottom: 40,
                  left: 50,
                },
                quality: 1,
              },
            );
            break;
          case 'saveSVG':
            graph.toSVG((dataUri: string) => {
              // 下载
              DataUri.downloadDataUri(DataUri.svgToDataUrl(dataUri), 'chart.svg');
            });
            break;
          case 'print':
            graph.printPreview();
            break;
          case 'copy':
            copy();
            break;
          case 'cut':
            cut();
            break;
          case 'paste':
            paste();
            break;
          case 'save':
            let newDagDetail1 = transferDag(graph);
            let yamlData1 = yaml.dump(newDagDetail1);

            props.methods?.submitDag(
              {
                business_id: newDagDetail1.workspace,
                feature_name: newDagDetail1.dagName,
                alias: newDagDetail1?.alias,
              },
              yamlData1,
            );
            console.log(
              'event save',
              newDagDetail1,
              newDagDetail1.workspace,
              newDagDetail1.dagName,
              props.methods,
            );
            break;
          case 'toJSON':
            console.log(graph.value, graph.value.getCells(), graph.value.options.meta);
            let newDagDetail = transferDag(graph);
            let yamlData = yaml.dump(newDagDetail);

            // openModal1(true, {newString: JSON.stringify(newDagDetail), oldString: JSON.stringify(graph.value.options.meta.data)});
            // openModal1(true, graph.value.toJSON());
            openModal1(true, { yaml: yamlData, json: JSON.stringify(newDagDetail) });

            // graph.fromJSON({cells:[graph.toJSON().cells[0],graph.toJSON().cells[1]]})
            break;
          default:
            break;
        }
      };

      // history.on('change', () => {
      //   canUndo.value = history.canUndo();
      //   canRedo.value = history.canRedo();
      // });
      // graph.bindKey('ctrl+z', () => {
      //   if (history.canUndo()) {
      //     history.undo();
      //   }
      //   return false;
      // });
      // graph.bindKey('ctrl+shift+z', () => {
      //   if (history.canRedo()) {
      //     history.redo();
      //   }
      //   return false;
      // });
      // graph.bindKey('ctrl+d', () => {
      //   graph.clearCells();
      //   return false;
      // });
      // graph.bindKey('ctrl+s', () => {
      //   graph.toPNG((datauri: string) => {
      //     DataUri.downloadDataUri(datauri, 'chart.png');
      //   });
      //   return false;
      // });
      // graph.bindKey('ctrl+p', () => {
      //   graph.printPreview();
      //   return false;
      // });
      // graph.bindKey('ctrl+c', copy);
      // graph.bindKey('ctrl+v', paste);
      // graph.bindKey('ctrl+x', cut);

      return {
        // canUndo,
        // canRedo,
        // copy,
        // cut,
        // paste,
        handleClick,
        openModal1,
        register1,
      };
    },
  });
</script>

<style lang="less" scoped>
  .bar {
    margin-right: 16px;
  }

  .item-space {
    margin-left: 16px;
  }
</style>
