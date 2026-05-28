import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);
// root.render(
//   <React.StrictMode>//严格模式
//     <App />
//   </React.StrictMode>
// );

reportWebVitals((metric) => {
  // 处理每个性能指标
  console.log(metric.name+":"+metric.value);
});
