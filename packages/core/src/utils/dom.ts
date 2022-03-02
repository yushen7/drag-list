export function insertAfter(container, src, target) {
  if (container.lastChild === target) {
    container.appendChild(src);
  } else {
    container.insertBefore(src, target.nextSibling);
  }
}