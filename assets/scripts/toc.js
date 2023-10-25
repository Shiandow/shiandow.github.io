function toggleToc() {
  document.body.toggleAttribute('hide-toc');
  document.getElementById('TOC').toggleAttribute('detached', false);
};

function dragToc(event) {
  event.dataTransfer.dropEffect = 'move';
  event.dataTransfer.setData('text', '#TOC');
};

/* Warning, here be dragons */
function dragOn(event) {
  if (event.dataTransfer.getData('text') == "#TOC") {
    event.preventDefault();
  }
}

function dragOff(event) {
  if (event.dataTransfer.getData('text') == "#TOC") {
    event.preventDefault();
  }
}

function attachToc(event) {
  if (event.dataTransfer.getData('text') == "#TOC") {
    // document.getElementById('TOC').toggleAttribute('left', false);
    document.getElementById('TOC').toggleAttribute('detached', false);
    document.body.toggleAttribute('hide-toc', false);
    document.removeEventListener("scroll", setCurrentToc);
    event.stopPropagation();
  }
}
    
function detachToc(event) {
  if (event.dataTransfer.getData('text') == "#TOC") {
    // document.getElementById('TOC').toggleAttribute('left', event.pageX < 0.5*document.documentElement.clientWidth);
    document.getElementById('TOC').toggleAttribute('detached', true);
    document.body.toggleAttribute('hide-toc', false);
    document.addEventListener("scroll", setCurrentToc);
    setCurrentToc();
    event.stopPropagation();
  }
}

function setCurrentToc() {
  const toc = document.getElementById("TOC");
  const links = toc.getElementsByTagName("a");
  for (let i = 0; i<links.length; i++) { 
    const link = links[i];
    // Get id
    const id = new URL(link.href).hash.substring(1);
    if (id === "") continue;

    // Check if header is in view
    const box = document.getElementById(id).getBoundingClientRect();
    if (box.top <= 30 || (i == 0) || (i == links.length - 1 && document.documentElement.scrollTop + window.innerHeight >= document.documentElement.scrollHeight - 100))
    {
      link.classList.add('current');
    } else {
      link.classList.remove('current');
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  let tocToggle = document.getElementById('TOC-toggle');
  tocToggle.removeAttribute("href");
  tocToggle.addEventListener("click", toggleToc);
  tocToggle.addEventListener("dragstart", dragToc);
  tocToggle.draggable = true
  
  let toc = document.getElementById('TOC');
  toc.addEventListener("dragstart", dragToc);
  toc.draggable = true;

  // Lift TOC out of article contents
  document.body.insertBefore(toc, toc.parentNode)

  // Don't move if dragged onto itself
  toc.addEventListener("drop", function(event) { event.stopPropagation() });

  // Detach when dropped on background
  document.body.addEventListener("dragover", dragOff);
  document.body.addEventListener("drop", detachToc);
  
  // Attach when dropped on content
  const children = document.body.children;
  for (let i = 0; i < children.length; i++) {
    children[i].addEventListener("dragover", dragOn);
    children[i].addEventListener("drop", attachToc);
  }
})