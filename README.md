https://beta-pro.ant.design/docs/getting-started-cn


## 菜单
app.tsx
```ts
 menu: {
      params: {
          userId: initialState?.currentUser?.userid,
      },
      request: async (params, defaultMenuData) => {
        console.log(defaultMenuData)   // 原始路由信息  可以在这里写 request
        return defaultMenuData
      }
}
```

## 路由定义
/config/config.ts