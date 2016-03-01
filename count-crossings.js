
export default function countCrossings(G, orderA, orderB) {
  return (
    countBetweenCrossings(G, orderA, orderB) +
    countLoopCrossings(G, orderA, orderB)
  );
}


export function countBetweenCrossings(G, orderA, orderB) {
  // http://jgaa.info/accepted/2004/BarthMutzelJuenger2004.8.2.pdf

  let north, south, p, q;
  if (orderA.length > orderB.length) {
    north = orderA;
    south = orderB;
  } else {
    north = orderB;
    south = orderA;
  }

  p = north.length;
  q = south.length;

  // lexicographically sorted edges from north to south
  let southSeq = [];
  north.forEach(u => {
    south.forEach((v, j) => {
      if (G.hasEdge(u, v) || G.hasEdge(v, u)) southSeq.push(j);
    });
  });

  // build accumulator tree
  let firstIndex = 1;
  while (firstIndex < q) firstIndex *= 2;
  const treeSize = 2 * firstIndex - 1;  // number of tree nodes
  firstIndex -= 1;                      // index of leftmost leaf
  let tree = new Array(treeSize).fill(0);

  // count the crossings
  let count = 0;
  southSeq.forEach(k => {
    let index = k + firstIndex;
    tree[index]++;
    while (index > 0) {
      if (index % 2) count += tree[index + 1];
      index = Math.floor((index - 1) / 2);
      tree[index]++;
    }
  });

  return count;
}


export function countLoopCrossings(G, orderA, orderB) {
  // Count crossings from edges within orderA and within orderB.
  // Only look for edges on the right of orderA (forward edges)
  // and on the left of orderB (reverse edges)

  // how many edges pass across?
  let crossA = orderA.map(d => 0),
      crossB = orderB.map(d => 0);

  orderA.forEach((u, i) => {
    G.successors(u).forEach(v => {
      if (u !== v && !G.edge(u, v).reverse) {
        let index = orderA.indexOf(v);
        if (index >= 0) {
          // console.log('edge A', u, v, index, i);
          if (i > index) {
            let j = index + 1;
            while (j < i) {
              crossA[j++] += 1;
            }
          } else {
            let j = i + 1;
            while (j < index) {
              crossA[j++] += 1;
            }
          }
          // console.log(crossA);
        }
      }
    });
  });

  orderB.forEach((u, i) => {
    G.successors(u).forEach(v => {
      if (u !== v && G.edge(u, v).reverse) {
        let index = orderB.indexOf(v);
        if (index >= 0) {
          // console.log('edge B', u, v, index, i);
          if (i > index) {
            let j = index + 1;
            while (j < i) {
              crossB[j++] += 1;
            }
          } else {
            let j = i + 1;
            while (j < index) {
              crossB[j++] += 1;
            }
          }
          // console.log(crossB);
        }
      }
    });
  });

  let count = 0;
  orderA.forEach((u, i) => {
    orderB.forEach((v, j) => {
      if (G.hasEdge(u, v) || G.hasEdge(v, u)) {
        count += crossA[i];
        count += crossB[j];
      }
    });
  });

  return count;
}
