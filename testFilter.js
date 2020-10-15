const input = [
  {
    value: 'Miss1',
    children: [
      { value: 'Miss2' },
      { value: 'Hit1', children: [ { value: 'Miss3' } ] }
    ]
  },
  {
    value: 'Miss4',
    children: [
      { value: 'Miss5' },
      { value: 'Miss6', children: [ { value: 'Hit2' } ] }
    ]
  },
  {
    value: 'Miss7',
    children: [
      { value: 'Miss8' },
      { value: 'Miss9', children: [ { value: 'Miss10' } ] }
    ]
  },
  {
    value: 'Hit3',
    children: [
      { value: 'Miss11' },
      { value: 'Miss12', children: [ { value: 'Miss13' } ] }
    ]
  },
  {
    value: 'Miss14',
    children: [
      { value: 'Hit4' },
      { value: 'Miss15', children: [ { value: 'Miss16' } ] }
    ]
  },
];

console.log(filter(input, 'Miss13'))

function filter(arr, term) {
  var matches = [];
  if (!Array.isArray(arr)) return matches;

  arr.forEach(function(i) {
      if (i.value.includes(term)) {
          matches.push(i);
      } else {
          let childResults = filter(i.children, term);
          if (childResults.length)
              matches.push(Object.assign({}, i, { children: childResults }));
      }
  })

  return matches;
}

