import React, { useCallback, useEffect, useState } from 'https://esm.sh/react@18';
import { createRoot } from 'https://esm.sh/react-dom@18/client';
import * as FilePond from 'https://unpkg.com/filepond/dist/filepond.esm.js';
import { FilePond as ReactFilePond } from 'https://esm.sh/react-filepond@7?external=react,react-dom,filepond';
import SimpleImageEditorPlugin from '../../src/index.js';

FilePond.registerPlugin(SimpleImageEditorPlugin);

const createSampleFile = ({ name, background, accent }) =>
  new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 520;
    canvas.height = 320;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = accent;
    ctx.fillRect(40, 40, 200, 140);
    ctx.fillRect(280, 140, 200, 140);

    ctx.fillStyle = '#0f172a';
    ctx.font = '600 28px Inter, system-ui, sans-serif';
    ctx.fillText('Sample', 56, 110);
    ctx.font = '500 18px Inter, system-ui, sans-serif';
    ctx.fillText(name, 56, 140);

    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(320, 40);
    ctx.lineTo(480, 40);
    ctx.lineTo(480, 120);
    ctx.stroke();

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          return;
        }
        resolve(new File([blob], `${name}.png`, { type: 'image/png' }));
      },
      'image/png',
      0.92
    );
  });

const App = () => {
  const [files, setFiles] = useState([]);

  const preloadSamples = useCallback(async () => {
    const samples = await Promise.all([
      createSampleFile({
        name: 'Sunset',
        background: '#fde68a',
        accent: '#f97316',
      }),
      createSampleFile({
        name: 'Ocean',
        background: '#bae6fd',
        accent: '#38bdf8',
      }),
    ]);

    setFiles(samples);
  }, []);

  useEffect(() => {
    preloadSamples();
  }, [preloadSamples]);

  return React.createElement(ReactFilePond, {
    files,
    onupdatefiles: setFiles,
    allowMultiple: true,
    credits: false,
    acceptedFileTypes: ['image/*'],
  });
};

const root = createRoot(document.getElementById('root'));
root.render(React.createElement(App));
