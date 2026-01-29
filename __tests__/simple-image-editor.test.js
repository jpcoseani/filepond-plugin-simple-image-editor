import plugin from '../src/index.js';

const createFilePondMock = () => {
  const filters = {};
  return {
    filters,
    FilePond: {
      addFilter: (name, callback) => {
        filters[name] = callback;
      },
      getOptions: () => ({
        simpleImageEditor: {},
      }),
    },
  };
};

const createItem = () => ({
  id: 'item-1',
  file: new File(['test'], 'test.png', { type: 'image/png' }),
  setMetadata: jest.fn(),
  setFile: jest.fn(),
});

const setupFileReaderMock = () => {
  class MockFileReader {
    readAsDataURL() {
      this.result = 'data:image/png;base64,AA';
      if (this.onload) {
        this.onload();
      }
    }
  }
  global.FileReader = MockFileReader;
};

const setupImageMock = () => {
  global.Image = class MockImage {
    constructor() {
      this.naturalWidth = 100;
      this.naturalHeight = 80;
      this.width = 100;
      this.height = 80;
    }

    set src(value) {
      this._src = value;
      if (this.onload) {
        this.onload();
      }
    }

    get src() {
      return this._src;
    }
  };
};

const setupCanvasMock = () => {
  HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
    clearRect: jest.fn(),
    save: jest.fn(),
    translate: jest.fn(),
    rotate: jest.fn(),
    scale: jest.fn(),
    drawImage: jest.fn(),
    restore: jest.fn(),
  }));

  HTMLCanvasElement.prototype.toBlob = function toBlob(callback) {
    callback(new Blob(['data'], { type: 'image/png' }));
  };
};

const setupCryptoMock = () => {
  let counter = 0;
  global.crypto = {
    randomUUID: () => `uuid-${counter++}`,
  };
};

const waitForPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

beforeEach(() => {
  document.body.innerHTML = '';
  setupCryptoMock();
  setupFileReaderMock();
  setupImageMock();
  setupCanvasMock();
});

test('renders the pencil editor button', () => {
  // Arrange
  const { FilePond, filters } = createFilePondMock();
  plugin(FilePond);

  const item = createItem();
  document.body.innerHTML = `
    <div class="filepond--item" data-filepond-item-id="${item.id}"></div>
  `;

  // Act
  filters.DID_CREATE_ITEM(item);

  // Assert
  const button = document.querySelector('[data-simple-image-editor="true"]');
  expect(button).not.toBeNull();
});

test('opens and closes the modal when editing', async () => {
  // Arrange
  const { FilePond, filters } = createFilePondMock();
  plugin(FilePond);

  const item = createItem();
  document.body.innerHTML = `
    <div class="filepond--item" data-filepond-item-id="${item.id}"></div>
  `;

  // Act
  filters.DID_CREATE_ITEM(item);

  const button = document.querySelector('[data-simple-image-editor="true"]');
  button.click();

  await waitForPromises();

  const modal = document.querySelector('.filepond--simple-editor-modal');
  expect(modal).not.toBeNull();

  const cancelButton = modal.querySelector('button');
  cancelButton.click();

  await waitForPromises();

  // Assert
  expect(document.querySelector('.filepond--simple-editor-modal')).toBeNull();
});

test('updates rotation and flip state before applying', async () => {
  // Arrange
  const { FilePond, filters } = createFilePondMock();
  plugin(FilePond);

  const item = createItem();
  document.body.innerHTML = `
    <div class="filepond--item" data-filepond-item-id="${item.id}"></div>
  `;

  // Act
  filters.DID_CREATE_ITEM(item);

  const button = document.querySelector('[data-simple-image-editor="true"]');
  button.click();

  await waitForPromises();

  const modal = document.querySelector('.filepond--simple-editor-modal');
  const buttons = Array.from(modal.querySelectorAll('button'));
  const rotateRight = buttons.find((element) => element.textContent === 'Rotate right');
  const flipHorizontal = buttons.find(
    (element) => element.textContent === 'Flip horizontally'
  );
  const applyButton = buttons.find((element) => element.textContent === 'Apply');

  rotateRight.click();
  flipHorizontal.click();
  applyButton.click();

  await waitForPromises();

  // Assert
  expect(item.setMetadata).toHaveBeenCalledWith('simpleImageEditor', {
    rotation: 90,
    flipX: true,
    flipY: false,
  });
  expect(document.querySelector('.filepond--simple-editor-modal')).toBeNull();
});
