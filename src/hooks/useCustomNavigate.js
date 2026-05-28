// src/hooks/useCustomNavigate.js
const navigationFunctions = {
  // 带数据的导航
  navigateWithData: (path, data) => {
    // 使用localStorage临时存储数据
    const key = `temp_nav_data_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(key, JSON.stringify({
      data,
      timestamp: Date.now(),
      expireTime: Date.now() + 30 * 60 * 1000 // 30分钟过期
    }));
    
    // 清理过期数据
    navigationFunctions.cleanupExpiredData();
    
    // 执行导航
    window.location.href = `${path}?navDataKey=${key}`;
  },

  // 从URL参数获取传递的数据
  getDataFromUrl: () => {
    const urlParams = new URLSearchParams(window.location.search);
    const navDataKey = urlParams.get('navDataKey');
    
    if (navDataKey) {
      const storedData = localStorage.getItem(navDataKey);
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          
          // 检查是否过期
          if (parsedData.expireTime && parsedData.expireTime < Date.now()) {
            localStorage.removeItem(navDataKey);
            return null;
          }
          
          // 使用后删除数据（一次性使用）
          localStorage.removeItem(navDataKey);
          return parsedData.data;
        } catch (e) {
          console.error('Error parsing navigation data:', e);
          localStorage.removeItem(navDataKey);
          return null;
        }
      }
    }
    return null;
  },

  // 清理过期数据
  cleanupExpiredData: () => {
    const now = Date.now();
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('temp_nav_data_')) {
        try {
          const item = JSON.parse(localStorage.getItem(key));
          if (item.expireTime && item.expireTime < now) {
            localStorage.removeItem(key);
          }
        } catch (e) {
          // 忽略解析错误
        }
      }
    });
  },

  // 标准导航（不带数据）
  navigate: (path) => {
    window.location.href = path;
  }
};

export default navigationFunctions;