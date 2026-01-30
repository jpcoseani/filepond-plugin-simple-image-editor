const pencilIconUrl = new URL('../assets/pencil.svg', import.meta.url).toString();

const defaultLabels = {
  editorButtonLabel: 'Edit image',
  editorButtonIcon: `<img src="${pencilIconUrl}" alt="" aria-hidden="true" />`,
  modalTitle: 'Edit image',
  modalDescription: 'Use the controls to rotate or flip your image.',
  cancelButtonLabel: 'Cancel',
  applyButtonLabel: 'Apply',
  actionLabels: {
    rotateLeft: 'Rotate left',
    rotateRight: 'Rotate right',
    flipHorizontal: 'Flip horizontally',
    flipVertical: 'Flip vertically',
  },
};

const defaultClasses = {
  classButton: '',
  classModal: '',
  classControls: '',
  classRotateButton: '',
  classFlipButton: '',
};

const resolveLabels = (options = {}) => {
  const custom = options.simpleImageEditor?.labels ?? {};
  return {
    ...defaultLabels,
    ...custom,
    actionLabels: {
      ...defaultLabels.actionLabels,
      ...(custom.actionLabels ?? {}),
    },
  };
};

const resolveClasses = (options = {}) => {
  const custom = options.simpleImageEditor ?? {};
  return {
    ...defaultClasses,
    ...custom,
  };
};

const applyClassNames = (element, className) => {
  if (!element || !className) {
    return;
  }
  className
    .split(' ')
    .map((name) => name.trim())
    .filter(Boolean)
    .forEach((name) => element.classList.add(name));
};

const createModal = ({ labels, classes }) => {
  const titleId = `simple-editor-title-${crypto.randomUUID()}`;
  const descriptionId = `simple-editor-description-${crypto.randomUUID()}`;
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
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-labelledby', titleId);
  dialog.setAttribute('aria-describedby', descriptionId);
  dialog.setAttribute('tabindex', '-1');
  applyClassNames(dialog, classes.classModal);
  Object.assign(dialog.style, {
    background: '#fff',
    borderRadius: '8px',
    padding: '20px',
    width: 'min(92vw, 880px)',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    boxShadow: '0 20px 50px rgba(15, 23, 42, 0.25)',
  });

  const header = document.createElement('div');
  Object.assign(header.style, {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  });

  const title = document.createElement('h2');
  title.id = titleId;
  title.textContent = labels.modalTitle;
  Object.assign(title.style, {
    margin: '0',
    fontSize: '20px',
    fontWeight: '600',
  });

  const description = document.createElement('p');
  description.id = descriptionId;
  description.textContent = labels.modalDescription;
  Object.assign(description.style, {
    margin: '0',
    fontSize: '14px',
    color: '#475569',
  });

  header.appendChild(title);
  header.appendChild(description);

  const body = document.createElement('div');
  Object.assign(body.style, {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
    gap: '16px',
    alignItems: 'start',
  });

  const previewPanel = document.createElement('div');
  Object.assign(previewPanel.style, {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f8fafc',
    borderRadius: '12px',
    padding: '16px',
    minHeight: '260px',
  });

  const canvas = document.createElement('canvas');
  Object.assign(canvas.style, {
    maxWidth: '100%',
    maxHeight: '60vh',
    alignSelf: 'center',
    borderRadius: '6px',
    background: '#fff',
  });

  previewPanel.appendChild(canvas);

  const controlPanel = document.createElement('div');
  Object.assign(controlPanel.style, {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  });

  const toolbarTitle = document.createElement('h3');
  toolbarTitle.textContent = 'Adjustments';
  Object.assign(toolbarTitle.style, {
    margin: '0',
    fontSize: '15px',
    fontWeight: '600',
  });

  const toolbar = document.createElement('div');
  applyClassNames(toolbar, classes.classControls);
  Object.assign(toolbar.style, {
    display: 'grid',
    gap: '8px',
  });

  const actions = [
    { key: 'rotate-left', label: labels.actionLabels.rotateLeft },
    { key: 'rotate-right', label: labels.actionLabels.rotateRight },
    { key: 'flip-horizontal', label: labels.actionLabels.flipHorizontal },
    { key: 'flip-vertical', label: labels.actionLabels.flipVertical },
  ];

  const actionButtons = new Map();

  actions.forEach((action) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = action.label;
    button.setAttribute('aria-label', action.label);
    if (action.key.startsWith('flip')) {
      button.setAttribute('aria-pressed', 'false');
    }
    if (action.key.startsWith('rotate')) {
      applyClassNames(button, classes.classRotateButton);
    }
    if (action.key.startsWith('flip')) {
      applyClassNames(button, classes.classFlipButton);
    }
    Object.assign(button.style, {
      padding: '10px 12px',
      borderRadius: '8px',
      border: '1px solid #d7dde5',
      background: '#fff',
      cursor: 'pointer',
      fontSize: '14px',
      textAlign: 'left',
    });
    toolbar.appendChild(button);
    actionButtons.set(action.key, button);
  });

  controlPanel.appendChild(toolbarTitle);
  controlPanel.appendChild(toolbar);

  body.appendChild(previewPanel);
  body.appendChild(controlPanel);

  const footer = document.createElement('div');
  Object.assign(footer.style, {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
  });

  const cancelButton = document.createElement('button');
  cancelButton.type = 'button';
  cancelButton.textContent = labels.cancelButtonLabel;
  Object.assign(cancelButton.style, {
    padding: '8px 16px',
    borderRadius: '6px',
    border: '1px solid #d0d0d0',
    background: '#fff',
    cursor: 'pointer',
  });

  const applyButton = document.createElement('button');
  applyButton.type = 'button';
  applyButton.textContent = labels.applyButtonLabel;
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

  dialog.appendChild(header);
  dialog.appendChild(body);
  dialog.appendChild(footer);
  overlay.appendChild(dialog);

  return {
    overlay,
    dialog,
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

const updatePreviewElement = (itemElement, previewUrl) => {
  if (!itemElement || !previewUrl) {
    return;
  }

  const previewImage = itemElement.querySelector(
    '.filepond--image-preview img, .filepond--image-preview-wrapper img'
  );
  if (previewImage) {
    previewImage.src = previewUrl;
  }

  const previewContainers = itemElement.querySelectorAll(
    '.filepond--image-preview, .filepond--image-preview-wrapper'
  );
  previewContainers.forEach((previewContainer) => {
    previewContainer.style.backgroundImage = `url("${previewUrl}")`;
  });
};

const updateItemFile = (item, file, metadata, previewUrl, itemElement) => {
  if (item?.setMetadata && metadata) {
    item.setMetadata('simpleImageEditor', metadata);
  }

  if (item?.setMetadata && previewUrl) {
    item.setMetadata('poster', previewUrl);
  }

  if (typeof item?.setFile === 'function') {
    item.setFile(file);
    updatePreviewElement(itemElement, previewUrl);
    return;
  }

  if (typeof item?.setFile === 'undefined' && item?.file) {
    item.file = file;
  }

  updatePreviewElement(itemElement, previewUrl);
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

const openEditorModal = async ({ item, labels, classes, itemElement }) => {
  const modal = createModal({ labels, classes });
  const previousActiveElement = document.activeElement;
  const focusableSelector =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const focusableElements = () =>
    Array.from(modal.dialog.querySelectorAll(focusableSelector)).filter(
      (element) => !element.hasAttribute('disabled')
    );

  const closeModal = () => {
    modal.overlay.remove();
    if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
      previousActiveElement.focus();
    }
    document.removeEventListener('keydown', handleKeydown);
  };

  const handleKeydown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeModal();
      return;
    }

    if (event.key !== 'Tab') {
      return;
    }

    const focusables = focusableElements();
    if (focusables.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const isShift = event.shiftKey;

    if (!isShift && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    } else if (isShift && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    }
  };

  document.body.appendChild(modal.overlay);
  document.addEventListener('keydown', handleKeydown);

  const [initialFocus] = focusableElements();
  if (initialFocus) {
    initialFocus.focus();
  } else {
    modal.dialog.focus();
  }

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
      modal.actionButtons.get('flip-horizontal').setAttribute('aria-pressed', String(flipX));
      redraw();
    });

    modal.actionButtons.get('flip-vertical').addEventListener('click', () => {
      flipY = !flipY;
      modal.actionButtons.get('flip-vertical').setAttribute('aria-pressed', String(flipY));
      redraw();
    });

    modal.cancelButton.addEventListener('click', () => {
      closeModal();
    });

    modal.applyButton.addEventListener('click', () => {
      modal.applyButton.disabled = true;
      modal.canvas.toBlob((blob) => {
        if (!blob) {
          closeModal();
          return;
        }
        const previewUrl = modal.canvas.toDataURL(file.type || 'image/png');
        const editedFile = new File([blob], file.name, { type: blob.type });
        updateItemFile(
          item,
          editedFile,
          { rotation, flipX, flipY },
          previewUrl,
          itemElement
        );
        closeModal();
      }, file.type || 'image/png');
    });
  } catch (error) {
    closeModal();
    // eslint-disable-next-line no-console
    console.warn('[SimpleImageEditor]', error);
  }
};

const addEditorButton = (item, itemElement, labels, classes) => {
  if (!itemElement || itemElement.querySelector('[data-simple-image-editor]')) {
    return;
  }

  const button = document.createElement('button');
  button.type = 'button';
  button.setAttribute('data-simple-image-editor', 'true');
  button.setAttribute('aria-label', labels.editorButtonLabel);
  button.setAttribute('title', labels.editorButtonLabel);
  button.innerHTML = labels.editorButtonIcon;
  applyClassNames(button, classes.classButton);
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

  const icon = button.querySelector('img');
  if (icon) {
    Object.assign(icon.style, {
      width: '16px',
      height: '16px',
    });
  }

  button.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    openEditorModal({ item, labels, classes, itemElement });
  });

  itemElement.style.position = 'relative';
  itemElement.appendChild(button);
};

const plugin = (fpAPI) => {
  const { addFilter, utils } = fpAPI;
  const { Type, createRoute } = utils;

  const isImage = (file) => file && /^image\//.test(file.type);

  addFilter('CREATE_VIEW', (viewAPI) => {
    const { is, view, query } = viewAPI;

    // solo en la vista de archivo (item)
    if (!is('file')) return;

    const didLoadItem = ({ root, props }) => {
      const { id } = props;
      const item = query('GET_ITEM', id);
      if (!item || item.archived || !isImage(item.file)) return;

      // ✅ acá leés tu option (porque query existe acá)
      const simpleOpts =
        root.query('GET_SIMPLE_IMAGE_EDITOR') ?? {
          labels: defaultLabels,
          ...defaultClasses,
        };

      const labels = resolveLabels({ simpleImageEditor: simpleOpts });
      const classes = resolveClasses({ simpleImageEditor: simpleOpts });

      // ✅ acá tenés el elemento del item real
      addEditorButton(item, root.element, labels, classes);
    };

    view.registerWriter(
      createRoute(
        { DID_LOAD_ITEM: didLoadItem },
        () => {
          // writer noop (opcional)
        }
      )
    );
  });

  return {
    options: {
      // esto crea GET_SIMPLE_IMAGE_EDITOR
      simpleImageEditor: [
        {
          labels: defaultLabels,
          ...defaultClasses,
        },
        Type.OBJECT,
      ],
    },
  };
};

export default plugin;
