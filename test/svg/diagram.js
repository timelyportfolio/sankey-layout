import ordering from 'lib/node-ordering';
import sankeyDiagram from 'lib/svg/diagram';
import addDummyNodes from 'lib/add-dummy-nodes';
import assignRanks from 'lib/rank-assignment';
import { createGraph } from 'lib/utils';

import d3 from 'd3';
import test from 'prova';


test('diagram', t => {
  // prepare data
  const {nodes, edges} = exampleBlastFurnace();

  const G = createGraph(nodes, edges);
  assignRanks(G, []);
  addDummyNodes(G);
  const order = ordering(G);

  // diagram

  const diagram = sankeyDiagram();

  const el = d3.select('body').append('div');

  el
    .datum({graph: G, order: order})
    .call(diagram);

  t.equal(el.selectAll('.node')[0].length, G.nodes().length,
          'right number of nodes');

  t.equal(el.selectAll('.link')[0].length, G.edges().length,
          'right number of links');

  t.end();
});


function exampleBlastFurnace() {
  // Simplified example of flows through coke oven and blast furnace
  const nodes = [
  ];

  const edges = [
    // main flow
    {source: 'input', target: 'oven', value: 2.5},
    {source: 'oven', target: 'coke', value: 2.5},
    {source: 'coke', target: 'sinter', value: 1},
    {source: 'coke', target: 'bf', value: 1.5},
    {source: 'sinter', target: 'bf', value: 1},
    {source: 'bf', target: 'output', value: 1},
    {source: 'bf', target: 'export', value: 1},

    // additional export flows, and input-sinter
    {source: 'sinter', target: 'export', value: 0.2},
    {source: 'oven', target: 'export', value: 0.2},
    {source: 'input', target: 'sinter', value: 0.2},

    // return loops
    {source: 'oven', target: 'input', value: 0.5},
    {source: 'bf', target: 'input', value: 0.5},
  ];

  return {nodes, edges};
}
