/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: any } | undefined) {
  const { currentUser } = initialState ?? {};

  return {
    // canAdmin: currentUser && currentUser.access === 'admin',
    admin: () => {
      return currentUser.username === 'pho'
    },
    op: () => currentUser.username === '123',
  };
}
