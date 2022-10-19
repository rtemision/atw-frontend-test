const targets = new Map();
const observer = new ResizeObserver((entries) => {
  entries.forEach((entry) => {
    const callback = targets.get(entry.target);
    if (callback) callback(entry);
  });
});

export const resizeObserver = {
  add: (domNode, callback) => {
    if (targets.get(domNode)) {
      throw new Error(`A callback has already been set
        for this element "${domNode.className}".
        You must delete it first or use another element`);
    }

    targets.set(domNode, callback);
    observer.observe(domNode);
  },

  remove: (domNode) => {
    targets.delete(domNode);
    observer.unobserve(domNode);
  }
};
