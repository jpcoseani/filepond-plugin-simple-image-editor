const createModal = () => {
  const overlay = document.createElement('div');
  overlay.className = 'filepond--simple-editor-modal';
  Object.assign(overlay.style, {
    position: 'fixed',
    inset: '0',
    background: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '9999',
  });

  const dialog = document.createElement('div');
  Object.assign(dialog.style, {
    background: '#fff',
    borderRadius: '8px',
    padding: '16px',
    width: 'min(90vw, 860px)',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  });

  const canvas = document.createElement('canvas');
  Object.assign(canvas.style, {
    maxWidth: '100%',
    maxHeight: '60vh',
    alignSelf: 'center',
    borderRadius: '6px',
    background: '#f5f5f5',
  });

  const toolbar = document.createElement('div');
  Object.assign(toolbar.style, {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    justifyContent: 'center',
  });

  const actions = [
    { key: 'rotate-left', label: '⟲ Rotate Left' },
    { key: 'rotate-right', label: '⟳ Rotate Right' },
    { key: 'flip-horizontal', label: '⇋ Flip Horizontal' },
    { key: 'flip-vertical', label: '⇅ Flip Vertical' },
  ];

  const actionButtons = new Map();

  actions.forEach((action) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = action.label;
    Object.assign(button.style, {
      padding: '8px 12px',
      borderRadius: '6px',
      border: '1px solid #d0d0d0',
      background: '#fff',
      cursor: 'pointer',
    });
    toolbar.appendChild(button);
    actionButtons.set(action.key, button);
  });

  const footer = document.createElement('div');
  Object.assign(footer.style, {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
  });

  const cancelButton = document.createElement('button');
  cancelButton.type = 'button';
  cancelButton.textContent = 'Cancel';
  Object.assign(cancelButton.style, {
    padding: '8px 16px',
    borderRadius: '6px',
    border: '1px solid #d0d0d0',
    background: '#fff',
    cursor: 'pointer',
  });

  const applyButton = document.createElement('button');
  applyButton.type = 'button';
  applyButton.textContent = 'Apply';
  Object.assign(applyButton.style, {
    padding: '8px 16px',
    borderRadius: '6px',
    border: '1px solid #1e5bd6',
    background: '#1e5bd6',
    color: '#fff',
    cursor: 'pointer',
  });

  footer.appendChild(cancelButton);
  footer.appendChild(applyButton);

  dialog.appendChild(canvas);
  dialog.appendChild(toolbar);
  dialog.appendChild(footer);
  overlay.appendChild(dialog);

  return {
    overlay,
    canvas,
    actionButtons,
    cancelButton,
    applyButton,
  };
};

const loadImageFromItem = (item) => {
  return new Promise((resolve, reject) => {
    const file = item?.file || item?.getFile?.();
    if (!file) {
      reject(new Error('No file available on item.'));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => resolve({ img, file });
      img.onerror = () => reject(new Error('Failed to load image data.'));
      img.src = reader.result;
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });
};

const updateItemFile = (item, file, metadata) => {
  if (item?.setMetadata && metadata) {
    item.setMetadata('simpleImageEditor', metadata);
  }

  if (typeof item?.setFile === 'function') {
    item.setFile(file);
    return;
  }

  if (typeof item?.setFile === 'undefined' && item?.file) {
    item.file = file;
  }
};

const drawImageToCanvas = ({ img, canvas, rotation, flipX, flipY }) => {
  const context = canvas.getContext('2d');
  if (!context) {
    return;
  }

  const width = img.naturalWidth || img.width;
  const height = img.naturalHeight || img.height;
  const normalizedRotation = ((rotation % 360) + 360) % 360;
  const isSideways = normalizedRotation === 90 || normalizedRotation === 270;

  canvas.width = isSideways ? height : width;
  canvas.height = isSideways ? width : height;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.save();
  context.translate(canvas.width / 2, canvas.height / 2);
  context.rotate((normalizedRotation * Math.PI) / 180);
  context.scale(flipX ? -1 : 1, flipY ? -1 : 1);
  context.drawImage(img, -width / 2, -height / 2, width, height);
  context.restore();
};

const openEditorModal = async ({ item }) => {
  const modal = createModal();
  document.body.appendChild(modal.overlay);

  let rotation = 0;
  let flipX = false;
  let flipY = false;

  try {
    const { img, file } = await loadImageFromItem(item);

    const redraw = () => {
      drawImageToCanvas({
        img,
        canvas: modal.canvas,
        rotation,
        flipX,
        flipY,
      });
    };

    redraw();

    modal.actionButtons.get('rotate-left').addEventListener('click', () => {
      rotation -= 90;
      redraw();
    });

    modal.actionButtons.get('rotate-right').addEventListener('click', () => {
      rotation += 90;
      redraw();
    });

    modal.actionButtons.get('flip-horizontal').addEventListener('click', () => {
      flipX = !flipX;
      redraw();
    });

    modal.actionButtons.get('flip-vertical').addEventListener('click', () => {
      flipY = !flipY;
      redraw();
    });

    modal.cancelButton.addEventListener('click', () => {
      modal.overlay.remove();
    });

    modal.applyButton.addEventListener('click', () => {
      modal.applyButton.disabled = true;
      modal.canvas.toBlob((blob) => {
        if (!blob) {
          modal.overlay.remove();
          return;
        }
        const editedFile = new File([blob], file.name, { type: blob.type });
        updateItemFile(item, editedFile, { rotation, flipX, flipY });
        modal.overlay.remove();
      }, file.type || 'image/png');
    });
  } catch (error) {
    modal.overlay.remove();
    // eslint-disable-next-line no-console
    console.warn('[SimpleImageEditor]', error);
  }
};

const addEditorButton = (item, itemElement) => {
  if (!itemElement || itemElement.querySelector('[data-simple-image-editor]')) {
    return;
  }

  const button = document.createElement('button');
  button.type = 'button';
  button.setAttribute('data-simple-image-editor', 'true');
  button.setAttribute('aria-label', 'Edit image');
  button.innerHTML = '✏️';
  Object.assign(button.style, {
    position: 'absolute',
    top: '8px',
    right: '8px',
    zIndex: '10',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: '1px solid rgba(0, 0, 0, 0.2)',
    background: 'rgba(255, 255, 255, 0.9)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  });

  button.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    openEditorModal({ item });
  });

  itemElement.style.position = 'relative';
  itemElement.appendChild(button);
};

const plugin = (FilePond) => {
  const { addFilter } = FilePond;

  addFilter('DID_CREATE_ITEM', (item) => {
    const itemElement = document.querySelector(
      `.filepond--item[data-filepond-item-id="${item.id}"]`
    );
    addEditorButton(item, itemElement);
  });

  addFilter('DID_UPDATE_ITEM_METADATA', (item) => {
    const itemElement = document.querySelector(
      `.filepond--item[data-filepond-item-id="${item.id}"]`
    );
    addEditorButton(item, itemElement);
  });
};

plugin.options = {};

export default plugin;

if (typeof window !== 'undefined' && window.FilePond) {
  window.FilePond.registerPlugin(plugin);
}
