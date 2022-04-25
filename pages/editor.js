import { useState } from 'react';
import { Editor, Viewer } from '@bytemd/react';
import gfm from '@bytemd/plugin-gfm';
import zh_Hans from 'bytemd/locales/zh_Hans.json';
import EditorPageLayout from '../components/editorPageLayout';

const plugins = [
  gfm(),
  // Add more plugins here
];

const EditorPage = () => {
  const [value, setValue] = useState('');
  const [token, setToken] = useState('');

  const handleSubmit = () => {
    console.log('OK');
    console.log(value);
    console.log(token);
  };

  return (
    <EditorPageLayout>
      <h1>编辑器</h1>
      <label htmlFor="github-token">
        GitHubToken
        <input
          id="github-token"
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
      </label>
      <Editor
        locale={zh_Hans}
        value={value}
        plugins={plugins}
        onChange={(v) => {
          setValue(v);
          console.log(v);
        }}
      />
      <button onClick={() => handleSubmit()}>提交</button>
    </EditorPageLayout>
  );
};

export default EditorPage;
