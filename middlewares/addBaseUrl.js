const addBaseUrl = (req, res, next) => {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  
    // Ghi đè phương thức res.json để thêm baseUrl vào các trường image
    const originalJson = res.json;
    res.json = function (data) {
      const modifiedData = JSON.parse(JSON.stringify(data)); // Deep clone
  
      // Hàm đệ quy để tìm và sửa các trường image
      const addBaseUrlToImages = (obj) => {
        if (Array.isArray(obj)) {
          obj.forEach(addBaseUrlToImages);
        } else if (obj && typeof obj === 'object') {
          for (const key in obj) {
            if (key === 'image' && obj[key] && !obj[key].startsWith('http')) {
              obj[key] = `${baseUrl}${obj[key]}`;
            } else {
              addBaseUrlToImages(obj[key]);
            }
          }
        }
      };
  
      addBaseUrlToImages(modifiedData);
      return originalJson.call(this, modifiedData);
    };
  
    next();
  };
  
  export default addBaseUrl;