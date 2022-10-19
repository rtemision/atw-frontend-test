const targets = new Map();
const observer = new ResizeObserver((entries, observer) => {
  entries.forEach((entry) => {
    const callback = targets.get(entry.target);
    callback && callback(entry);
  });
});

export const resizeObserver = {
  add: (domNode, callback) => {
    if (targets.get(domNode))
      throw `A callback has already been set
        for this element "${domNode.className}".
        You must delete it first or use another element`;

    targets.set(domNode, callback);
    observer.observe(domNode);
  },

  remove: (domNode) => {
    targets.delete(domNode);
    observer.unobserve(domNode);
  }
};
